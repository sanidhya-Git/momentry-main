import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import crypto from "crypto";
import Razorpay from "razorpay";

// Lazy-load Razorpay instance to ensure environment variables are loaded
let razorpay;
function getRazorpayInstance() {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_demokey123",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "demokey123",
    });
  }
  return razorpay;
}

export const createOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const order = await getRazorpayInstance().orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `booking_${bookingId}`,
    });

    const payment = new Payment({
      bookingId,
      userId: req.userId,
      amount,
      razorpayOrderId: order.id,
      status: "pending",
    });

    await payment.save();

    res.json({
      orderId: order.id,
      paymentId: payment._id,
      amount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { bookingId, paymentId, orderId, signature } = req.body;

    // Verify signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === signature;

    if (!isSignatureValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Update booking status
    await Booking.findByIdAndUpdate(bookingId, { status: "confirmed" });

    // Update payment status
    await Payment.findOneAndUpdate({ bookingId }, {
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      status: "completed",
    });

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email")
      .populate({
        path: "bookingId",
        populate: {
          path: "packageId",
          select: "title destination",
        },
      })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

