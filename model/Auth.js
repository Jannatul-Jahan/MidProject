const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Emails was not provided"],
    unique: true,
    maxLength: 30,
  },
  password: {
    type: String,
    required: [true, "Password was not provided"],
  },
  role: {
    type: Number,
    required: false,
    default:2
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  resetPassword:{
    type: Boolean||null,
    required: false,
    default: false,
  },
  resetPasswordToken:{
    type: String||null,
    required: false,
    default: null,
  },
  resetPasswordExpire:{
    type: Date||null,
    required: false,
    default: null,
  },
},
  {
    timestamps: true, 
  });
  
const Auth = mongoose.model("Auth", AuthSchema);
module.exports = Auth;
