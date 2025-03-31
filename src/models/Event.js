import mongoose, { mongo } from "mongoose";

const EventSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true, 
  }, 
  date:  {
    type: Date, 
    required: true, 
  }, 
  capacity: {
    type: Number, 
    required: true
  }, 
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true
  }, 
  attendees: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  }], 
}, { timestamps: true });

const Event = mongoose.model("Event", EventSchema);
export default Event;