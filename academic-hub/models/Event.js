// academic-hub/models/Event.js

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  eventDate: { type: Date, required: true },
  image: { type: String, default: '/uploads/default-event.png' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', EventSchema);