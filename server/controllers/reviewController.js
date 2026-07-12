import Review from '../models/Review.js'
import Booking from '../models/Booking.js'
import Package from '../models/Package.js'

export const submitReview = async (req, res) => {
  try {
    const { packageId, bookingId, rating, title, body } = req.body

    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.userId,
      packageId,
      status: 'confirmed',
    })

    if (!booking) {
      return res.status(403).json({ message: 'You must have a confirmed booking to review this package' })
    }

    const review = await Review.create({
      userId: req.userId,
      packageId,
      bookingId,
      rating,
      title,
      body,
    })

    res.status(201).json(review)
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this package' })
    }
    res.status(500).json({ message: e.message })
  }
}

export const getPackageReviews = async (req, res) => {
  try {
    const { packageId } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const totalReviews = await Review.countDocuments({ packageId, status: 'approved' })

    const reviews = await Review.find({ packageId, status: 'approved' })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const mongoose = (await import('mongoose')).default
    const pkgObjId = new mongoose.Types.ObjectId(packageId)

    const fullAgg = await Review.aggregate([
      { $match: { packageId: pkgObjId, status: 'approved' } },
      {
        $group: {
          _id: null,
          avg: { $avg: '$rating' },
          count1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
          count2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          count3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          count4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          count5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
        },
      },
    ])

    const aggData = fullAgg[0] || {}
    const avgRating = aggData.avg ? Math.round(aggData.avg * 10) / 10 : 0
    const ratingBreakdown = {
      1: aggData.count1 || 0,
      2: aggData.count2 || 0,
      3: aggData.count3 || 0,
      4: aggData.count4 || 0,
      5: aggData.count5 || 0,
    }

    res.json({
      reviews,
      totalReviews,
      avgRating,
      ratingBreakdown,
      page,
      pages: Math.ceil(totalReviews / limit),
    })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export const getAllReviews = async (req, res) => {
  try {
    const { status, page: pageQuery, limit: limitQuery } = req.query
    const page = parseInt(pageQuery) || 1
    const limit = parseInt(limitQuery) || 20
    const skip = (page - 1) * limit

    const filter = {}
    if (status && status !== 'all') {
      filter.status = status
    }

    const total = await Review.countDocuments(filter)

    const reviews = await Review.find(filter)
      .populate('userId', 'name email')
      .populate('packageId', 'title destination')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.json({
      reviews,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export const moderateReview = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const review = await Review.findByIdAndUpdate(id, { status }, { new: true })

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    if (status === 'approved') {
      const agg = await Review.aggregate([
        { $match: { packageId: review.packageId, status: 'approved' } },
        { $group: { _id: null, avg: { $avg: '$rating' } } },
      ])
      await Package.findByIdAndUpdate(review.packageId, { avgRating: agg[0]?.avg || 0 })
    }

    res.json(review)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.userId })
      .populate('packageId', 'title destination image')
      .sort({ createdAt: -1 })

    res.json(reviews)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}
