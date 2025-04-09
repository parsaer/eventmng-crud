import express from 'express';
import User from '../models/User.js';
import Event from '../models/Event.js';
import authMiddleWare from '../middleware/auth.js';
import adminMiddleWare from '../middleware/admin.js';

const router = express.Router();


// get all data that an admin can get all in on page? 
router.get('/overview', authMiddleWare, adminMiddleWare, async(req, res)=> {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const users = await User.find().select('email');
    const emails = users.map(user => user.email);
    const events = await Event.find().select('name attendees');
    const attendeesPerEvent = events.map(event => ({
      name: event.name,
      attendeesCount: event.attendees.length
    }));

    res.json({
      totalUsers,
      totalEvents,
      attendeesPerEvent,
      emails
    });
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});


// get all userds (admin)
router.get('/users', authMiddleWare, adminMiddleWare, async(req, res) => {
  try {
    const users = await User.find().select("email isAdmin createdAt");
    res.json(users);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});


router.get('/stats/events-count', authMiddleWare, adminMiddleWare, async(req, res) => {
  try {
    const cnt = await Event.countDocuments();
    res.json(cnt);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});


// get all events (admin)
router.get('/events', authMiddleWare, adminMiddleWare, async(req, res) => {
  try {
    const events  = await Event.find().populate("createdBy", "email");
    res.json(events);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});


// delete /admin/events/:eventId
router.delete('/event/:eventId', authMiddleWare, adminMiddleWare, async(req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findByIdAndDelete(eventId);
    if(!event) return res.status(404).json({error: "event not found"});

    res.json({message: "event deleted by admin"});
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});

// delete any user: /admin/user/:userId
router.delete('/user/:userId', authMiddleWare, adminMiddleWare, async(req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if(!user) return res.status(404).json({error: "user not found"});

    await Event.deleteMany({createdBy: userId});
    res.json({message: "user deleted by admin"});
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});

export default router;