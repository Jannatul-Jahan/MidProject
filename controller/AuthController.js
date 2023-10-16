const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const AuthModel = require("../model/Auth");
const UserModel = require("../model/User");
const HTTP_STATUS = require("../constants/statusCodes");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
const ejs = require("ejs");
const ejsRenderFile = promisify(ejs.renderFile);
const path = require("path");
const transporter = require("../config/mail");

class AuthController{ 
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const auth = await AuthModel.findOne({ email })
         .populate("user")
  
      if (!auth) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .send(failure("Invalid email or password"));
      }
  
      const checkPassword = await bcrypt.compare(password, auth.password);
      
      if (!checkPassword) {
        return res.status(HTTP_STATUS.OK).send(failure("Invalid ctrdentials"));
      }
  
      const responseAuth = auth.toObject();
      delete responseAuth.password;
      delete responseAuth._id;

      const jwt = jsonwebtoken.sign(responseAuth, process.env.SECRET_KEY, {
        expiresIn: "1h"});

      responseAuth.token = jwt;
      return res.status(HTTP_STATUS.OK).send(success("Login successful", responseAuth));
    } catch (error) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }
    
   
    async signup(req, res) {
        try {
          const validation = validationResult(req).array();
          if (validation.length > 0) {
            return res
              .status(HTTP_STATUS.BAD_REQUEST)
              .send(failure("Failed to add the user", validation));
          }
      
          const { name, email, password, address, role } = req.body;

          const existingUser = await UserModel.findOne({ email });
          if (existingUser) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Email is already in use"));
          }

          const hashedPassword = await bcrypt.hash(password, 10);
      
          const newUser = new UserModel({
            name: name,
            email: email,
            address: address,
          });
      
          await newUser.save();
      
          const authData = new AuthModel({
            email: email,
            password: hashedPassword,
            role: role,
            user: newUser._id, 
          });
      
          await authData.save();
      
          return res.status(HTTP_STATUS.OK).send(success("User registered successfully"));
        } catch (error) {
          return res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .send(failure("Internal server error"));
        }
      }

      async sendForgotPasswordEmail(req, res) {
        try {
          const { email } = req.body;
          if (!email || email === "") {
            return res
              .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
              .send(failure("Recipient email was not provided"));
          }
    
          const auth = await AuthModel.findOne({ email: email }).populate("user");
    
          if (!auth) {
            return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User not found"));
          }
    
          const resetToken = crypto.randomBytes(32).toString("hex");
    
          auth.resetPasswordToken = resetToken;
          auth.resetPasswordExpire = Date.now() + 3600000;
          auth.resetPassword = true;
    
          await auth.save();
    
          const resetURL = path.join(process.env.FRONTEND_URL,"users", "reset-password", resetToken, auth._id.toString());

          const htmlBody = await ejsRenderFile(path.join(__dirname, "..", "views", "forget-password.ejs"), {
            name: auth.user.name,
            resetURL: resetURL,
          });
    
          const result = await transporter.sendMail({
            from: "my-app@system.com",
            to: `${auth.user.name} ${email}`,
            subject: "Password Reset Request",
            html: htmlBody,
          });
    
          return res.status(HTTP_STATUS.OK).send(success("Successfully requested for resetting password"));
        } catch (error) {
          console.log(error);
          return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Something went wrong!"));
        }
      }
    
      async resetPassword(req, res) {
        try {
          const { token, userId, newPassword, confirmPassword } = req.body;
      
          const auth = await AuthModel.findOne({ user: userId });
          if (!auth) {
            return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Invalid request"));
          }
      
          if (newPassword !== confirmPassword) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Password and confirm password do not match"));
          }
    
          const hashedPassword = await bcrypt.hash(newPassword, 10);
      
          auth.password = hashedPassword;
          auth.resetPassword = false;
          await auth.save();
      
          return res.status(HTTP_STATUS.OK).send(success("Password updated successfully"));
        } catch (error) {
          console.log(error);
          return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Something went wrong!"));
        }
      }
      
      async validatePasswordResetRequest(req, res) {
        try {
          const { token, userId } = req.params;
      
          const auth = await AuthModel.findOne({ user: userId });
          if (!auth) {
            return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Invalid request"));
          }
      
          if (auth.resetPasswordExpire < Date.now()) {
            return res.status(HTTP_STATUS.GONE).send(failure("Expired request"));
          }
      
          if (auth.resetPasswordToken !== token || auth.resetPassword === false) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure("Invalid token"));
          }
          return res.status(HTTP_STATUS.OK).send(success("Request is still valid"));
        } catch (error) {
          console.log(error);
          return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Something went wrong!"));
        }
      }
      
      
}

module.exports = new AuthController;