const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const UserModel = require("../model/User");
const AuthModel = require("../model/Auth");
const HTTP_STATUS = require("../constants/statusCodes");

class UserController {
  async getAll(req, res) {
    try {
      const users = await UserModel.find({});
      
      if (users) {
        if (users.length > 0) {
                return res.status(HTTP_STATUS.OK).send(success("Successfully received all users", { result: users, total: users.length }));
              }
         return res.status(HTTP_STATUS.OK).send(success("No users were found"));
      } else {
        return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Failed to filter user's data"));
      }
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }
  // async getAll(req, res) {
  //   try {
  //     const users = await UserModel.find({});
  //     if (users.length > 0) {
  //       return res
  //         .status(HTTP_STATUS.OK)
  //         .send(success("Successfully received all users", { result: users, total: users.length }));
  //     }
  //     return res.status(HTTP_STATUS.OK).send(success("No users were found"));
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
  //   }
  // }

  async getOneById(req, res) {
    try {
      const { id } = req.params;
      
      const user = await UserModel.findById(id);
      if (user) {
        return res.status(HTTP_STATUS.OK).send(success("Successfully received the user", user));
      } else {
        return res.status(HTTP_STATUS.OK).send(failure("Failed to received the user"));
      }
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async deleteById(req, res) {
    try {
      const { id } = req.params;
  
      const user = await UserModel.findById(id);
  
      const auth = await AuthModel.findOne({ user }).populate("user");
  
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User not found"));
      }
  
      if (auth.role === 2) {
        const deletedUser = await UserModel.findByIdAndDelete(id);
  
        // Delete the corresponding auth data
        const authId = auth._id; 
        
        if (authId) {
          const deletedAuth = await AuthModel.findByIdAndDelete(authId);
          if (deletedUser && deletedAuth) {
            return res.status(HTTP_STATUS.OK).send(success("Successfully deleted the user data", deletedUser));
          }
        }
  
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Failed to delete user and/or auth data"));
      } else if (auth.role === 1) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Admin user cannot be deleted"));
      } else {
        // Handle other roles if needed
        return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Unsupported user role"));
      }
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }
  

  async updateById(req, res) {
    try {
      const { id } = req.params;
      const { name, email, address } = req.body;

      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { name, email, address },
        { new: true } 
      );

      if (updatedUser) {
        return res.status(HTTP_STATUS.OK).send(success("Successfully updated the user", updatedUser));
      } else {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User not found"));
      }
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async deleteAll(req, res) {
    try {
      await UserModel.deleteMany({});
      return res.status(HTTP_STATUS.OK).send(success("Successfully deleted all users"));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }


}

module.exports = new UserController();
