import mongoose from 'mongoose'
const SiteContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})
export default mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema)
