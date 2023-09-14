const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const UserModel = require("../model/User");
const HTTP_STATUS = require("../constants/statusCodes");

class UserController {
  async getAll(req, res) {
    try {
      const users = await UserModel.find({});
      if (users.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully received all users", { result: users, total: users.length }));
      }
      return res.status(HTTP_STATUS.OK).send(success("No users were found"));
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error"));
    }
  }

  async getOneById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById({ _id: id });
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


  


}

module.exports = new UserController();
