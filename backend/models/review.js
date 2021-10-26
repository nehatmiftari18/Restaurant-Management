import mongoose from 'mongoose';

const Review = mongoose.Schema({
  rate: {
    type: Number,
    required: true,
  },
  visited: {
    type: Date,
    default: () => new Date(),
  },
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  created: {
    type: Date,
    default: () => new Date()
  },
  replyComment: {
    type: String,
    default: '',
  },
  replyDate: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    default: 'pending'
  },
});

const ReviewModel = mongoose.model('Review', Review);

export default ReviewModel;
