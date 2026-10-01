import mongoose from 'mongoose'

const internshipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please provide internship role'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Please provide application date'],
      default: () => new Date().toISOString().split('T')[0],
    },
    status: {
      type: String,
      enum: ['Applied', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    location: {
      type: String,
      default: 'Remote',
      trim: true,
    },
    stipend: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

const Internship = mongoose.model('Internship', internshipSchema)
export default Internship
