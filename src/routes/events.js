import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

const router = express.Router();
const MAX_EVENTS_PER_USER = 3;

router.post('/', authMiddleware, async (req, res) => {
  const { name, date, capacity } = req.body;
  const userId = req.user.id;

  try {
    const eventCount = await Event.countDocuments({createdBy: userId});
    if(eventCount >= MAX_EVENTS_PER_USER) {
      return res.json(400).json({ error: "Event creation limit reached"})
    }

    const event = new Event({ name, date, capcacity, createdBy: userId});
    await event.save();

    res.status(201).json(event);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:eventId/join', authMiddleware, async(req, res)=> {
  const eventId = req.params.eventId;
  const userId = req.user.id;

  try {
    const event = await Event.findById(eventId);
    if(!event) return res.status(404).json({eror: "event not found"});

    if(event.attendees.includes(userId)) {
      return res.status(400).json({ error: "Already joined this evnet"});
    }

    if(event.attendees.length >= event.capcacity) {
      return res.status(400).json({ error: "evnet is full"});
    }

    event.attendees.push(userId);
    await event.save();

    res.json({ message: "Successfully joined", event});

  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my-events', authMiddleware, async(req, res)=> {
  const userId = req.user.id
  try {
    const myEvents = await Event.find({ createdBy: userId }).populate("attendees", "email");
    res.json(myEvents);
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
});

// edit <creator> events 

router.put('/:eventId', authMiddleware, async (req, res)=>{
  const eventId = req.params.eventId;
  const userId = req.user.id;
  const { name, date, capacity } = req.body;

  try{
    const event = await Event.findById(eventId);
    if(!event) return res.status(404).json({ error: "Event not found "});

    if(event.createdBy.toString() !== userId) { 
      return res.status(403).json({ error: "Unauthorized to edit this event"});
    }

    if(name) {
      event.name = name;
    }

    if(date) {
      event.date = date;
    }

    if(capacity) {
      event.capcacity = capcacity;
    }

    await event.save();
    res.json(event);

  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try{ 
    const events = await Event.find().select("-attendees");
    res.json(events);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;