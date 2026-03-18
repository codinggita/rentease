import dns from 'node:dns';
// Force Google DNS for SRV resolution (Required for MongoDB Atlas)
dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Rental from '../models/Rental.js';
import User from '../models/User.js';

dotenv.config();

const seedData = [
    {
        title: "Canon EOS R6 Mark II Mirrorless Camera",
        description: "Professional-grade mirrorless camera with 24.2 MP sensor, dual pixel CMOS AF II, and 4K 60p video. Perfect for weddings and professional events. Includes 24-105mm f/4L IS USM Lens.",
        category: "Electronics",
        pricePerDay: 1500,
        deposit: 5000,
        condition: "New",
        location: "Mumbai, Maharashtra",
        images: [
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1512790182412-b19e6d12bf45?auto=format&fit=crop&q=80&w=1000"
        ],
        availability: true
    },
    {
        title: "Apple MacBook Pro 16\" (M3 Pro, 36GB RAM)",
        description: "The ultimate power-house for developers and video editors. Features M3 Pro chip, 1TB SSD, and Liquid Retina XDR display. Comes with original charger and carry case.",
        category: "Electronics",
        pricePerDay: 2500,
        deposit: 10000,
        condition: "Like New",
        location: "Bengaluru, Karnataka",
        images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1611186871348-b1ec696e52c9?auto=format&fit=crop&q=80&w=1000"
        ],
        availability: true
    },
    {
        title: "Sony PlayStation 5 Console (Disc Edition)",
        description: "Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio. Includes 2 DualSense controllers.",
        category: "Electronics",
        pricePerDay: 800,
        deposit: 3000,
        condition: "Like New",
        location: "Delhi, NCR",
        images: [
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&q=80&w=1000"
        ],
        availability: true
    },
    {
        title: "DJI Mini 4 Pro Drone Fly More Combo",
        description: "Under 249g drone with 4K/60fps HDR True Vertical Shooting, 20km Video Transmission, and Omnidirectional Obstacle Sensing. Perfect for travel vlogging.",
        category: "Electronics",
        pricePerDay: 1200,
        deposit: 4000,
        condition: "New",
        location: "Pune, Maharashtra",
        images: [
            "https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1000"
        ],
        availability: true
    },
    {
        title: "Quechua 4-Person Waterproof Camping Tent",
        description: "Spacious 2-bedroom tent with Fresh & Black technology to keep you cool and in the dark. Wind resistant and waterproof. Easy setup even for beginners.",
        category: "Adventure",
        pricePerDay: 400,
        deposit: 1000,
        condition: "Good",
        location: "Dehradun, Uttarakhand",
        images: [
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=1000"
        ],
        availability: true
    },
    {
        title: "GoPro Hero 12 Black Action Camera",
        description: "Rugged action camera with 5.3K60 video, HyperSmooth 6.0 stabilization, and HDR. Includes chest mount, head strap, and 3 extra batteries.",
        category: "Adventure",
        pricePerDay: 500,
        deposit: 1500,
        condition: "Like New",
        location: "Goa",
        images: [
            "https://images.unsplash.com/photo-1565348877569-807d4f40f04f?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1629131726692-1accd0c93ce0?auto=format&fit=crop&q=80&w=1000"
        ],
        availability: true
    },
    {
        title: "BenQ 4K HDR Home Theater Projector",
        description: "True 4K UHD resolution with 3000 Lumens brightness. CinematicColor technology for accurate colors. Amazing for movie nights or big matches.",
        category: "Home",
        pricePerDay: 1000,
        deposit: 3500,
        condition: "New",
        location: "Hyderabad, Telangana",
        images: [
            "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1535016120720-40c646bebbdc?auto=format&fit=crop&q=80&w=1000"
        ],
        availability: true
    },
    {
        title: "Segway Ninebot KickScooter G30P",
        description: "Electric scooter with 65km range and 30km/h max speed. 10-inch pneumatic tires for smooth rides. Foldable and easy to carry.",
        category: "Adventure",
        pricePerDay: 600,
        deposit: 2000,
        condition: "Good",
        location: "Bengaluru, Karnataka",
        images: [
            "https://images.unsplash.com/photo-1605030342111-e1f2956cf57f?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1000"
        ],
        availability: true
    },
    {
        title: "Bosch Professional Cordless Drill Kit",
        description: "Heavy-duty 18V cordless drill/driver with 2 batteries and charger. High torque for drilling in wood, metal, and plastic. Includes 50-piece accessory set.",
        category: "Tools",
        pricePerDay: 250,
        deposit: 800,
        condition: "Good",
        location: "Chennai, Tamil Nadu",
        images: [
            "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&q=80&w=1000"
        ],
        availability: true
    },
    {
        title: "Black+Decker 1400W Pressure Washer",
        description: "Powerful high-pressure washer for cleaning cars, patios, and walls. 110 bar max pressure with multiple nozzle attachments.",
        category: "Tools",
        pricePerDay: 300,
        deposit: 1000,
        condition: "Good",
        location: "Kolkata, West Bengal",
        images: [
            "https://images.unsplash.com/photo-1520211417414-22d83b8a01cb?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000"
        ],
        availability: true
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            family: 4
        });
        console.log("Connected to MongoDB...");

        // Find a user to be the owner
        const user = await User.findOne();
        if (!user) {
            console.error("NO USER FOUND. Please signup at least one user first.");
            process.exit(1);
        }

        console.log(`Using owner: ${user.name} (${user._id})`);

        // Clear existing rentals
        await Rental.deleteMany({});
        console.log("Existing rentals cleared.");

        // Add owner ID to each rental
        const finalData = seedData.map(item => ({
            ...item,
            owner: user._id
        }));

        await Rental.insertMany(finalData);
        console.log(`${finalData.length} records seeded successfully!`);

        process.exit();
    } catch (err) {
        console.error("Seeding Error:", err.message);
        process.exit(1);
    }
};

seedDB();
