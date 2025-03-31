import mongoose from "mongoose";
import { string } from "zod";

const UserSchema =  new mongoose.Schema({
  email: {
    type: String, 
    require: true, 
    unique: true, 
  }, 
  password: {
    type: String, 
    require: true, 
  }, 
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;