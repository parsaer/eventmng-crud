import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

const router = express.Router();
const MAX_EVENTS_PER_USER = 3;

// create event
router.post('/', authMiddleware, async (req, res) => {
  const { name, date, capacity } = req.body;
  const userId = req.user.id;

  try {
    const eventCount = await Event.countDocuments({createdBy: userId});
    if(eventCount >= MAX_EVENTS_PER_USER) {
      return res.status(400).json({ error: "Event creation limit reached"})
    }

    const event = new Event({ name, date, capacity, createdBy: userId, attendees: []});
    await event.save();

    res.status(201).json(event);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// get all events -> no auth
router.get('/', async (req, res)=> {
  try {
    const events = await Event.find().select("name date capacity createdBy").populate("createdBy", "email");
    res.json(events);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// get single event detail
router.get('/:eventId', authMiddleware, async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;

  try {
    const event = await Event.findById(eventId).populate("attendees", "email");
    if(!events) return res.status(404).json({ error: "event not found "});

    if(event.createdBy.toString() == userId) {
      return res.json({
        name: event.name, 
        date: event.date, 
        capacity: event.capacity, 
        createdAt: event.createdAt,
        createdBy: event.createdBy,
        attendees: event.attendees, 
      });
    }

    res.json({
      name:event.name, 
      date: event.date, 
      capacity: event.capacity, 
      attendeesCount: event.attendees.length,
    });
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});


// get events created by USER
router.get('/my-events', authMiddleware, async(req, res)=> {
  const userId = req.user.id;
  try  {
    const myEvents = await Event.find({ createdBy: userId }).populate("attendees", "email");
    res.json(myEvents);
  } catch(err) {
    res.status(500).json({error:err.message});
  }
});


// USER joined events
router.get('/joined-events', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const joined = await Event.find({attendees: userId}).select("name date capacity attendees");

      res.json(joined.map((event) => ({
      name: event.name,
      date: event.date,
      capacity: event.capacity,
      attendeesCount: event.attendees.length,
    })));
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});


// edit event (auth needed)
router.put('/:eventId', authMiddleware, async(req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;
  const {name, date, capacity} = req.body;
  try {
    const event = await Event.findById(eventId);
    if(!event) return res.status(404).json({error:"Event not found"});

    if(event.createdBy.toString() != userId) 
        return res.status(403).json({error: "Not authorized to edit an event"});
    
    if(name) event.name = name;
    if(date) event.date = date;
    if(capacity) event.capacity = capacity;
    // if(status) event.status = status;

    await event.save();
    res.json(event);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});


// delete event (auth needed)
router.delete('/:eventId', authMiddleware, async(req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;
  try {
    const event = await Event.findById(eventId).select("attendees createdBy");
    if(!event) return res.status(404).json({error: "event not found"});

    if(event.createdBy.toString() != userId) 
        return res.status(403).json({error: "Unauthorized to delete an event"});
    
    if(event.attendees.length > 0) 
        return res.status(400).json({error: "people already registered"});

    // await event.delete(); 
    await event.deleteOne();
    res.json({message: "event deleted successfully"});

  } catch(err) {
    res.status(500).json({error: err.message});
  }
});


// join event
router.post('/:eventId/join', authMiddleware, async(req, res)=> {
  const eventId = req.params.eventId;
  const userId = req.user.id;

  try {
    const event = await Event.findById(eventId);
    if(!event) return res.status(404).json({error: "event not found"});

    if(event.attendees.includes(userId)) {
      return res.status(400).json({ error: "Already joined this event"});
    }

    if(event.attendees.length >= event.capacity) {
      return res.status(400).json({ error: "event is full"});
    }

    event.attendees.push(userId);
    await event.save();

    res.json({ message: "Successfully joined", event});

  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;