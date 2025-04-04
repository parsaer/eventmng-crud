import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true, 
    trim: true,  
  }, 
  date:  {
    type: Date, 
    required: true, 
    validate: {
      validator: function(value) {
        return value > new Date();
      }, 
      message: "Event date must be in the future", 
    },
  }, 
  capacity: {
    type: Number, 
    required: true, 
    min: [1, "Capacity must be at lest 1"], 
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