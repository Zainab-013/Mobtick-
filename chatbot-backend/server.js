import express from "express";
import cors from "cors";
import dotenv from "dotenv";
require('dotenv').config(); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Session tracking
const sessions = {};

// Helper for random reply
function randomReply(replies) {
  return replies[Math.floor(Math.random() * replies.length)];
}

// Root
app.get("/", (req, res) => {
  res.send("<h1 style='color:green'>🤖 Mobtick Chatbot backend running!</h1>");
});

// Chat API
app.post("/chat", (req, res) => {
  const userId = req.body.userId || "default";
  let msg = req.body.message?.toLowerCase().trim() || "";

  if (!sessions[userId]) sessions[userId] = { context: null, lastMessage: null };

  let botReply;

  // ------------------ 1. GREETING ------------------
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    botReply = randomReply([
      "Hello! 👋 Welcome to Mobtick. Do you want to explore Men’s, Women’s, or Kids watches?",
      "Hi there! I can help you find the perfect watch ⌚. Which category interests you?",
    ]);
    sessions[userId].context = "greeting";
  }

  // ------------------ 2. PRODUCT-RELATED ------------------
 // ------------------ 2. PRODUCT-RELATED ------------------
// women first so it doesn't get caught by "men"
else if (msg.includes("women")) {
  botReply = "Here are some Women’s watches: Titan Raga, Casio Sheen, Fossil Jacqueline.";
} else if (msg.includes("men")) {
  botReply = "Here are some Men’s watches: Titan Quartz, Fossil Chronograph, Casio G-Shock.";
} else if (msg.includes("kids")) {
  botReply = "Yes! We have Kids watches like Sonata Super Fibre, Zoop Time Machine.";

  } else if (msg.includes("latest")) {
    botReply = "Our latest arrivals include Titan Neo Splash, Fossil Gen 6 Smartwatch, Casio Vintage Series.";
  } else if (msg.includes("discount")) {
    botReply = "These are on discount 🎉: Titan Edge (-20%), Fossil Grant (-15%), Casio G-Shock (-10%).";
  } else if (msg.includes("brand") || msg.includes("titan") || msg.includes("casio") || msg.includes("fossil")) {
    botReply = "Popular brands available: Titan, Casio, Fossil, Noise, Fire-Boltt.";
  } else if (msg.includes("smartwatch")) {
    botReply = "We have Smartwatches like Titan Smart Pro, Fossil Hybrid HR, Noise ColorFit Ultra.";
  }

  // ------------------ 3. PRICE & BUDGET ------------------
 
else if (msg.includes("price") || msg.includes("prices") || msg.includes("cost")) {
  botReply = "Our watches start from ₹1,500 and go up to ₹25,000+. You can also filter by budget like 'under 2000' or 'above 10000'.";
} else if (msg.includes("under 2000") || msg.includes("below 2000")) {
  botReply = "Watches under ₹2000: Sonata Essentials, Fastrack Casual, Noise Smartwatch Lite.";
} else if (msg.includes("above 10000") || msg.includes("premium")) {
  botReply = "Premium watches above ₹10,000: Titan Edge, Fossil Townsman, Casio Edifice.";
} else if (msg.includes("budget")) {
  botReply = "Best budget watches: Fastrack Reflex, Sonata Digital, Noise ColorFit Pulse.";
} else if (msg.includes("emi")) {
  botReply = "Yes ✅ EMI options are available on most watches above ₹2000.";
}


  // ------------------ 4. PRODUCT DETAILS ------------------
  else if (msg.includes("detail") || msg.includes("show me this")) {
    botReply = "Click on the product to view full details including price, warranty, and strap type.";
  } else if (msg.includes("warranty")) {
    botReply = "Most watches come with a 1–2 year manufacturer warranty.";
  } else if (msg.includes("waterproof")) {
    botReply = "Yes! Many models are water-resistant (30m–100m). Check product specs.";
  } else if (msg.includes("strap")) {
    botReply = "Available strap types: Leather, Metal, Silicone, Nylon.";
  }

  // ------------------ 5. SHOPPING EXPERIENCE ------------------
  else if (msg.includes("add to cart")) {
    botReply = "To add an item to cart, just click 'Add to Cart' on the product page.";
  } else if (msg.includes("track order")) {
    botReply = "Please enter your Order ID to track your delivery 📦.";
  } else if (msg.includes("return") || msg.includes("refund")) {
    botReply = "We offer a 14-day return policy. Refunds are processed within 5–7 business days.";
  } else if (msg.includes("delivery") || msg.includes("shipping")) {
    botReply = "Delivery usually takes 3–5 business days across India.";
  }
  else if (msg.includes("location") || msg.includes("address")) {
    botReply = "Bandra Carter road";
  }

  // ------------------ 6. CUSTOMER SUPPORT ------------------
  else if (msg.includes("login")) {
    botReply = "If you face login issues, you can reset your password on the login page.";
  } else if (msg.includes("password")) {
    botReply = "No worries 😊 Use the 'Forgot Password' option to reset.";
  } else if (msg.includes("contact") || msg.includes("support")) {
    botReply = "You can reach us at 📧 support@mobtick.com or ☎️ 1800-123-456.";
  } else if (msg.includes("phone") || msg.includes("email")) {
    botReply = "Customer Care: support@mobtick.com | 1800-123-456.";
  }

  // ------------------ 7. FUN / THANKS ------------------
  else if (msg.includes("thanks") || msg.includes("thank you")) {
    botReply = randomReply([
      "You’re welcome! 😊",
      "Glad I could help! 👍",
      "Anytime! Let me know if you need more info.",
    ]);
  } else if (msg.includes("joke")) {
    botReply = randomReply([
      "Why did the watch go to school? To learn how to tell time! ⏰😂",
      "I’d tell you a time joke, but I’m afraid it’s not the right time 😆",
    ]);
  }

  // ------------------ 8. FALLBACK ------------------
  else {
    botReply = "Sorry 😅 I didn’t get that. You can ask about watches, prices, warranty, delivery, or support.";
  }

  // Save last message
  sessions[userId].lastMessage = msg;

  console.log("🤖 Reply:", botReply);
  res.json({ reply: botReply });
});

app.listen(PORT, () => {
  console.log(`✅ Mobtick Chatbot running on http://localhost:${PORT}`);
});