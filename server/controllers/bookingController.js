import Booking from "../models/Booking.js";
import Package from "../models/Package.js";
import Review from '../models/Review.js'

export const createBooking = async (req, res) => {
  try {
    const { packageId, quantity } = req.body;

    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    const booking = new Booking({
      userId: req.userId,
      packageId,
      quantity,
      totalPrice: pkg.price * quantity,
      status: "pending",
    });

    await booking.save();
    await booking.populate("packageId");

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).populate(
      "packageId",
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("packageId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("packageId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminDashboardStats = async (req, res) => {
  try {
    // 1. MTD Revenue (Month-To-Date confirmed bookings)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const mtdBookings = await Booking.find({
      status: "confirmed",
      createdAt: { $gte: firstDayOfMonth }
    });
    const mtdRevenue = mtdBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    // 2. Total Bookings Count
    const totalBookingsCount = await Booking.countDocuments();

    // 3. Active Trips Count
    const activeTripsCount = await Package.countDocuments({ isActive: true });

    // 4. Last 7 Days Daily Bookings (relative to current week)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recent7DaysBookings = await Booking.find({
      createdAt: { $gte: sevenDaysAgo }
    });

    const dailyCounts = {};
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayLabel = daysOfWeek[d.getDay()];
      dailyCounts[dayLabel] = 0;
    }

    recent7DaysBookings.forEach(booking => {
      const dayLabel = daysOfWeek[new Date(booking.createdAt).getDay()];
      if (dailyCounts[dayLabel] !== undefined) {
        dailyCounts[dayLabel] += 1;
      }
    });

    const bookingsChart = Object.keys(dailyCounts).map(day => ({
      day,
      count: dailyCounts[day],
    }));

    // 5. Recent Bookings (Last 10 bookings populated)
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name email")
      .populate("packageId", "title destination price");

    const ratingAgg = await Review.aggregate([{ $match: { status: 'approved' } }, { $group: { _id: null, avg: { $avg: '$rating' } } }])
    const avgRating = ratingAgg[0] ? Math.round(ratingAgg[0].avg * 10) / 10 : 0

    res.json({
      mtdRevenue,
      totalBookings: totalBookingsCount,
      activeTrips: activeTripsCount,
      avgRating,
      bookingsChart,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email phone")
      .populate("packageId", "title destination price duration departureDate")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


