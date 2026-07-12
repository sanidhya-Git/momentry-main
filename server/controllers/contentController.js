import SiteContent from '../models/SiteContent.js'

const DEFAULT_CONTENT = {
  hero: {
    headline: 'Travel elegantly. Explore deeply.',
    subtext: 'Handpicked boutique journeys, curated by local storytellers.',
    cta: 'Explore Trips'
  },
  testimonials: [],
  featuredPackages: []
}

export const getAllContent = async (req, res) => {
  try {
    const docs = await SiteContent.find()
    res.json(docs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getContent = async (req, res) => {
  try {
    const { key } = req.params
    const doc = await SiteContent.findOne({ key })
    if (doc) {
      return res.json(doc)
    }
    if (key in DEFAULT_CONTENT) {
      return res.json({ key, data: DEFAULT_CONTENT[key] })
    }
    res.status(404).json({ message: 'Content not found' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateContent = async (req, res) => {
  try {
    const { key } = req.params
    const updated = await SiteContent.findOneAndUpdate(
      { key },
      { $set: { data: req.body.data, updatedAt: new Date(), updatedBy: req.userId } },
      { upsert: true, new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
