// server.js — Chatbot Backend (ES Modules, Render-ready)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// ⚠️ IMPORTANT
// Render will automatically provide PORT
const PORT = process.env.PORT || 5000;

// ------------------ MIDDLEWARE ------------------
app.use(
  cors({
    origin: [
      "https://customer-five-iota.vercel.app",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"],
    credentials: true
  })
);


app.use(express.json());

// ------------------ SESSION MEMORY ------------------
const sessions = {};

// Helper for random replies
function randomReply(replies) {
  return replies[Math.floor(Math.random() * replies.length)];
}

// ------------------ ROOT TEST ROUTE ------------------
app.get("/", (req, res) => {
  res.send("<h1 style='color:green'>🤖 Mobtick Chatbot backend running!</h1>");
});

// ------------------ CHAT API ------------------
app.post("/chat", (req, res) => {
  const userId = req.body.userId || "default";
  const msg = (req.body.message || "").toLowerCase().trim();

  if (!sessions[userId]) {
    sessions[userId] = { context: null, lastMessage: null };
  }

  let botReply = "";

  // -------- 1. GREETING --------
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    botReply = randomReply([
      "Hello! 👋 Welcome to Mobtick. Do you want to explore Men’s, Women’s, or Kids watches?",
      "Hi there! I can help you find the perfect watch ⌚. Which category interests you?",
    ]);
    sessions[userId].context = "greeting";
  }

  // -------- 2. PRODUCT CATEGORIES --------
  else if (msg.includes("women")) {
    botReply = "Here are some Women’s watches: Titan Raga, Casio Sheen, Fossil Jacqueline.";
  } else if (msg.includes("men")) {
    botReply = "Here are some Men’s watches: Titan Quartz, Fossil Chronograph, Casio G-Shock.";
  } else if (msg.includes("kids")) {
    botReply = "We also have Kids watches like Sonata Super Fibre and Zoop Time Machine.";
  } else if (msg.includes("latest")) {
    botReply = "Latest arrivals: Titan Neo Splash, Fossil Gen 6 Smartwatch, Casio Vintage Series.";
  } else if (msg.includes("discount")) {
    botReply = "Current discounts 🎉: Titan Edge (-20%), Fossil Grant (-15%), Casio G-Shock (-10%).";
  } else if (msg.includes("brand") || msg.includes("titan") || msg.includes("casio") || msg.includes("fossil")) {
    botReply = "Popular brands: Titan, Casio, Fossil, Noise, Fire-Boltt.";
  } else if (msg.includes("smartwatch")) {
    botReply = "Smartwatches available: Titan Smart Pro, Fossil Hybrid HR, Noise ColorFit Ultra.";
  }

  // -------- 3. PRICE & BUDGET --------
  else if (msg.includes("price") || msg.includes("cost")) {
    botReply = "Prices start from ₹1,500 up to ₹25,000+. Try asking 'under 2000' or 'above 10000'.";
  } else if (msg.includes("under 2000")) {
    botReply = "Under ₹2000: Sonata Essentials, Fastrack Casual, Noise Smartwatch Lite.";
  } else if (msg.includes("above 10000") || msg.includes("premium")) {
    botReply = "Premium watches: Titan Edge, Fossil Townsman, Casio Edifice.";
  } else if (msg.includes("emi")) {
    botReply = "Yes ✅ EMI options are available on most watches above ₹2000.";
  }

  // -------- 4. PRODUCT DETAILS --------
  else if (msg.includes("warranty")) {
    botReply = "Most watches come with a 1–2 year manufacturer warranty.";
  } else if (msg.includes("waterproof")) {
    botReply = "Many watches are water-resistant (30m–100m). Check product specs.";
  } else if (msg.includes("strap")) {
    botReply = "Strap options: Leather, Metal, Silicone, Nylon.";
  }

  // -------- 5. DELIVERY & RETURNS --------
  else if (msg.includes("delivery") || msg.includes("shipping")) {
    botReply = "Delivery usually takes 3–5 business days across India.";
  } else if (msg.includes("return") || msg.includes("refund")) {
    botReply = "We offer a 14-day return policy. Refunds are processed in 5–7 business days.";
  }

  // -------- 6. SUPPORT --------
  else if (msg.includes("contact") || msg.includes("support")) {
    botReply = "Contact us at 📧 support@mobtick.com or ☎️ 1800-123-456.";
  }

  // -------- 7. THANKS / FUN --------
  else if (msg.includes("thanks") || msg.includes("thank you")) {
    botReply = randomReply([
      "You’re welcome! 😊",
      "Happy to help! 👍",
      "Anytime! Let me know if you need more info.",
    ]);
  } else if (msg.includes("joke")) {
    botReply = randomReply([
      "Why did the watch go to school? To learn how to tell time! ⏰😂",
      "I’d tell you a time joke, but it’s not the right time 😆",
    ]);
  }

  // -------- 8. FALLBACK --------
  else {
    botReply = "Sorry 😅 I didn’t get that. You can ask about watches, prices, delivery, or support.";
  }

  sessions[userId].lastMessage = msg;
  console.log("🤖 Reply:", botReply);

  res.json({ reply: botReply });
});

// ------------------ START SERVER ------------------
app.listen(PORT, () => {
  console.log(`🤖 Mobtick Chatbot backend running on port ${PORT}`);
});
