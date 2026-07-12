import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, maxlength: 100, trim: true },
  body: { type: String, required: true, maxlength: 1000, trim: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
})

ReviewSchema.index({ userId: 1, packageId: 1 }, { unique: true })

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema)
