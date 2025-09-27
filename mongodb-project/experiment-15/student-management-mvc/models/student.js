const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  course: { type: String, required: true },
  city: { type: String }  // Add this line
});

module.exports = mongoose.model('Student', studentSchema);
