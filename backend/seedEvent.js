const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Event = require("./models/Event"); // Adjust path if needed

dotenv.config();

// Your events data
const events = [
  {
    title: "Wedding",
    slug: "weddings",
    price: 2000,
    duration: "8 hours",
    location: "Delhi",
    date: new Date("2025-12-15"),
    img: "Wedding.jpg",
  },
  {
    title: "Birthday Party",
    slug: "birthday-party",
    price: 500,
    duration: "4 hours",
    location: "Mumbai",
    date: new Date("2025-11-10"),
    img: "Cake.png",
  },
  {
    title: "Anniversary",
    slug: "anniversary",
    price: 1500,
    duration: "6 hours",
    location: "Bangalore",
    date: new Date("2025-10-20"),
    img: "Anniversary.jpg",
  },
  {
    title: "Corporate Event",
    slug: "corporate-event",
    price: 3000,
    duration: "10 hours",
    location: "Hyderabad",
    date: new Date("2025-11-25"),
    img: "Corporate.jpg",
  },
  {
    title: "Theme Party",
    slug: "theme-party",
    price: 1200,
    duration: "5 hours",
    location: "Pune",
    date: new Date("2025-12-01"),
    img: "ThemeParty.jpg",
  },
  {
    title: "Baby Shower",
    slug: "baby-shower",
    price: 1000,
    duration: "4 hours",
    location: "Chennai",
    date: new Date("2025-10-30"),
    img: "BabyShower.jpg",
  },
  {
    title: "Graduation Party",
    slug: "graduation-party",
    price: 800,
    duration: "3 hours",
    location: "Kolkata",
    date: new Date("2025-11-15"),
    img: "Graduation.jpg",
  },
  {
    title: "Camping",
    slug: "camping",
    price: 600,
    duration: "12 hours",
    location: "Rishikesh",
    date: new Date("2025-12-05"),
    img: "Camping.jpg",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await Event.deleteMany(); // Optional: clear old events
    const created = await Event.insertMany(events);
    console.log(`Inserted ${created.length} events`);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });
