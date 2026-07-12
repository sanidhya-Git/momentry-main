import dotenv from "dotenv";
dotenv.config(); // Load environment variables FIRST (no-op on Vercel — env is injected)

import express from "express";
import cors from "cors";
import { connectDB } from "./config/database.js";
import User from "./models/User.js";
import Package from "./models/Package.js";
import bcrypt from "bcryptjs";

// Routes
import authRoutes from "./routes/authRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

// CORS — allowlist built from env (FRONTEND_URL = main site, ADMIN_URL = admin panel)
// plus localhost dev origins. If neither env var is set, fall back to allowing all
// origins (non-breaking default). Requests with no Origin header (curl, health
// checks, server-to-server) are always allowed.
const envOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean);
if (envOrigins.length > 0) {
  const allowedOrigins = new Set([
    ...envOrigins.map((o) => o.replace(/\/+$/, "")),
    "http://localhost:5173",
    "http://localhost:5174",
  ]);
  app.use(
    cors({
      origin: (origin, callback) => {
        // No origin → curl / health checks / same-origin: allow
        if (!origin) return callback(null, true);
        callback(null, allowedOrigins.has(origin.replace(/\/+$/, "")));
      },
    }),
  );
} else {
  app.use(cors());
}

// Middleware
app.use(express.json());

// Initialize admin and sample packages
const initializeData = async () => {
  try {
    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        salt,
      );

      const admin = new User({
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        isAdmin: true,
      });
      await admin.save();
      console.log("✅ Admin user created");
    }

    // Ensure Boutique Kyoto Escape exists
    const kyotoExists = await Package.findOne({ title: "Boutique Kyoto Escape" });
    if (!kyotoExists) {
      const kyotoPkg = new Package({
        title: "Boutique Kyoto Escape",
        destination: "Kyoto, Japan",
        price: 105000,
        duration: 7,
        maxParticipants: 10,
        description:
          "A meticulously curated luxury experience in Japan's cultural heart. Wander through bamboo groves, participate in private tea ceremonies, and sleep in premium heritage machiyas.",
        image:
          "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=500&fit=crop",
        highlights: [
          "Heritage machiya residence stay",
          "Evening welcome matcha ceremony",
          "Lantern-lit stroll through Gion",
          "Arashiyama bamboo grove tour",
          "Private sake tasting cellars",
          "Farewell luxury onsen retreat",
        ],
        itinerary: [
          { day: 1, title: "Arrival & Gion Twilight Walk", description: "Private airport transfer to your heritage machiya residence. Evening welcome ceremony with matcha tasting, followed by a lantern-lit walk through Gion with your local storyteller. Dinner at a 9-seat kaiseki counter." },
          { day: 2, title: "Arashiyama Bamboo & Tea Masters", description: "Early morning visit to Arashiyama bamboo path. Private workshop with a 15th-generation tea master, learning the fine art of whisking ceremonial Uji matcha." },
          { day: 3, title: "Fushimi Inari at Dawn · Sake Cellars", description: "Hike the iconic vermillion torii gates of Fushimi Inari before the crowds arrive. Afternoon tasting flight at a historical sake brewery in the Fushimi district." },
          { day: 4, title: "Nara's Giants & Uji Matcha", description: "Day excursion to Nara to see the colossal Buddha at Todai-ji and the bowing deer. Stop in Uji, the birthplace of Japanese green tea." },
          { day: 5, title: "Golden Pavilion & Zen Gardens", description: "Discover the golden Kinkaku-ji reflection. Afternoon meditating at Ryoan-ji's rock garden under the guidance of a resident monk." },
          { day: 6, title: "Traditional Crafts & Kimono Silk", description: "Visit a master weaver's studio in Nishijin. Spend the afternoon strolling along the Philosopher's Path." },
          { day: 7, title: "Farewell Onsen Retreat", description: "Conclude your journey at a luxury ryokan on the outskirts of Kyoto, featuring natural hot spring baths and a spectacular multi-course kaiseki dinner." }
        ],
        departureDate: new Date("2026-10-12"),
        bookingEndDate: new Date("2026-09-12"),
        isActive: true,
      });
      await kyotoPkg.save();
      console.log("✅ Boutique Kyoto Escape package seeded");
    }

    // Create sample packages - only if database is empty
    const packagesCount = await Package.countDocuments();
    if (packagesCount === 0) {
      const samplePackages = [
        {
          title: "Triund Trek - Mountain Paradise",
          destination: "Himachal Pradesh",
          price: 6999,
          duration: 2,
          maxParticipants: 20,
          description:
            "Experience the magical sunrise at Triund with breathtaking Himalayan views and pristine nature.",
          image:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
          highlights: [
            "Mountain Trek",
            "Sunrise View",
            "Local Tea",
            "Photography",
          ],
          isActive: true,
        },
        {
          title: "Kasol - Backpackers' Haven",
          destination: "Himachal Pradesh",
          price: 5999,
          duration: 3,
          maxParticipants: 25,
          description:
            "Discover the bohemian vibes of Kasol with scenic riverside trails and vibrant culture.",
          image:
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop",
          highlights: ["River Trails", "Local Cafes", "Adventure", "Culture"],
          isActive: true,
        },
        {
          title: "Tungnath - Sacred Heights",
          destination: "Uttarakhand",
          price: 8999,
          duration: 3,
          maxParticipants: 15,
          description:
            "Trek to the world's highest Shiva temple at Tungnath with pristine alpine meadows.",
          image:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
          highlights: ["Temple Trek", "Alpine Meadows", "Spiritual", "Adventure"],
          isActive: true,
        },
        {
          title: "Kedarnath Pilgrimage",
          destination: "Uttarakhand",
          price: 12999,
          duration: 4,
          maxParticipants: 20,
          description:
            "Sacred journey to Kedarnath with stunning mountain views and spiritual experiences.",
          image:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
          highlights: [
            "Sacred Temple",
            "Mandakini River",
            "Mountain Views",
            "Spiritual",
          ],
          isActive: true,
        },
        {
          title: "Shimla - Hill Station Classic",
          destination: "Himachal Pradesh",
          price: 7999,
          duration: 3,
          maxParticipants: 30,
          description:
            "Explore the charming colonial hill station of Shimla with mall roads and scenic landscapes.",
          image:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
          highlights: [
            "Mall Road",
            "Historic Sites",
            "Scenic Views",
            "Toy Train",
          ],
          isActive: true,
        },
        {
          title: "Spiti Valley - Hidden Gem",
          destination: "Himachal Pradesh",
          price: 16999,
          duration: 6,
          maxParticipants: 12,
          description:
            "Journey through the mystical Spiti Valley with ancient monasteries and surreal landscapes.",
          image:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
          highlights: [
            "Monasteries",
            "Scenic Drives",
            "Local Culture",
            "Adventure",
          ],
          isActive: true,
        },
        {
          title: "Manali - Adventure Capital",
          destination: "Himachal Pradesh",
          price: 9999,
          duration: 5,
          maxParticipants: 18,
          description:
            "Adventure activities in Manali including paragliding, river rafting, and trekking.",
          image:
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop",
          highlights: [
            "Paragliding",
            "River Rafting",
            "Trekking",
            "Scenic Views",
          ],
          isActive: true,
        },
        {
          title: "Jaipur - The Pink City",
          destination: "Rajasthan",
          price: 5999,
          duration: 3,
          maxParticipants: 30,
          description:
            "Explore the iconic pink city of Jaipur with magnificent forts and palaces.",
          image:
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop",
          highlights: ["City Palace", "Hawa Mahal", "Local Markets", "Heritage"],
          isActive: true,
        },
        {
          title: "Udaipur - Venice of India",
          destination: "Rajasthan",
          price: 11999,
          duration: 4,
          maxParticipants: 25,
          description:
            "Experience the romantic beauty of Udaipur with palace lakes and royal architecture.",
          image:
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop",
          highlights: [
            "City Palace",
            "Lake Pichola",
            "Boat Cruise",
            "Royal Experience",
          ],
          isActive: true,
        },
        {
          title: "Goa Beach Paradise",
          destination: "Goa",
          price: 8999,
          duration: 5,
          maxParticipants: 20,
          description:
            "Experience the vibrant culture of Goa with beautiful beaches, water sports, and amazing nightlife.",
          image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop",
          highlights: [
            "Beach Resort",
            "Water Sports",
            "Nightlife",
            "Local Cuisine",
          ],
          isActive: true,
        },
      ];

      await Package.insertMany(samplePackages);
      console.log("✅ Sample packages created");
    } else {
      console.log("✅ Packages already exist in database, skipping sample creation");
    }
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

// Run the seeder at most once per warm instance (module-level promise guard).
let initPromise = null;
const ensureInitialized = () => {
  if (!initPromise) {
    initPromise = initializeData();
  }
  return initPromise;
};

// Lazy DB connect (cached across invocations) + one-time seeding, before all routes.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    await ensureInitialized();
    next();
  } catch (e) {
    next(e);
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

// Also matched at /api/* — Next.js rewrites /sitemap.xml → /api/sitemap.xml
// so the request reaches the Express catch-all mounted under /api.
app.get(['/sitemap.xml', '/api/sitemap.xml'], async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true }, '_id createdAt').lean()
    const baseUrl = 'https://momentry.in'
    const staticUrls = ['/', '/packages', '/about']
    const pkgUrls = packages.map(p => '/packages/' + p._id)
    const allUrls = [...staticUrls, ...pkgUrls]
    const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      allUrls.map(u => '<url><loc>' + baseUrl + u + '</loc><changefreq>weekly</changefreq><priority>' + (u==='/'?'1.0':'0.8') + '</priority></url>').join('') +
      '</urlset>'
    res.header('Content-Type', 'application/xml').send(xml)
  } catch(e) { res.status(500).send('Sitemap error') }
})
app.get(['/robots.txt', '/api/robots.txt'], (req, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: https://momentry.in/sitemap.xml')
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

export default app;
