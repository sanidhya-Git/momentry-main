import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import User from '../models/User.js';

export const getRevenueAnalytics = async (req, res) => {
  try {
    // Monthly revenue for last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyRaw = await Booking.aggregate([
      {
        $match: {
          status: 'confirmed',
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyRevenue = monthlyRaw.map((item) => {
      const [year, month] = item._id.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      const monthName = date.toLocaleString('en-US', { month: 'short' });
      return {
        month: `${monthName} ${year}`,
        revenue: item.revenue,
        bookings: item.bookings,
      };
    });

    // Revenue by destination (top 8)
    const revenueByDestination = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      {
        $lookup: {
          from: 'packages',
          localField: 'packageId',
          foreignField: '_id',
          as: 'pkg',
        },
      },
      { $unwind: '$pkg' },
      {
        $group: {
          _id: '$pkg.destination',
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 8 },
      { $project: { destination: '$_id', revenue: 1, bookings: 1, _id: 0 } },
    ]);

    // Summary counts
    const [totalRevAgg, totalB, confirmedB, totalUsers] = await Promise.all([
      Booking.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      User.countDocuments({ isAdmin: { $ne: true } }),
    ]);

    const totalRevenue = totalRevAgg[0]?.total || 0;

    // Average rating (optional model)
    const avgRating = await (async () => {
      try {
        const Review = (await import('../models/Review.js')).default;
        const agg = await Review.aggregate([
          { $match: { status: 'approved' } },
          { $group: { _id: null, avg: { $avg: '$rating' } } },
        ]);
        return agg[0]?.avg || 0;
      } catch {
        return 0;
      }
    })();

    res.json({
      monthlyRevenue,
      revenueByDestination,
      summary: {
        totalRevenue,
        totalBookings: totalB,
        confirmedBookings: confirmedB,
        totalUsers,
      },
      avgRating,
    });
  } catch (error) {
    console.error('getRevenueAnalytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};
