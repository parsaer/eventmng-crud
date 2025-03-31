
import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "event-mngmnt", 
    });
    console.log("MongoDB Connected")
  } catch(err) {
    console.error(`Error while connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;