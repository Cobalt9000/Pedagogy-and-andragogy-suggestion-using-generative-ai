import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true
  },
  suggestions: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Suggestion', suggestionSchema);