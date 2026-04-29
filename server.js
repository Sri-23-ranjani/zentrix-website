const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

let demos = [];
let reviews = [
  {
    id: 1,
    company: "CloudOps Team",
    role: "DevOps Lead",
    review: "ZENTRIX gives clear root cause insights and reduces manual log analysis."
  },
  {
    id: 2,
    company: "FinTech Backend Team",
    role: "Backend Engineer",
    review: "The AI daemon concept is highly useful for microservices debugging."
  }
];

app.post("/api/book-demo", (req, res) => {
  const { name, company, email, message } = req.body;

  if (!name || !company || !email) {
    return res.status(400).json({ success: false, error: "Required fields missing" });
  }

  demos.push({
    id: Date.now(),
    name,
    company,
    email,
    message,
    created_at: new Date().toISOString()
  });

  res.json({ success: true, message: "Demo request submitted successfully" });
});

app.get("/api/demo-requests", (req, res) => {
  res.json(demos);
});

app.post("/api/reviews", (req, res) => {
  const { company, role, review } = req.body;

  if (!company || !role || !review) {
    return res.status(400).json({ success: false, error: "Required fields missing" });
  }

  reviews.unshift({
    id: Date.now(),
    company,
    role,
    review,
    created_at: new Date().toISOString()
  });

  res.json({ success: true, message: "Review added successfully" });
});

app.get("/api/reviews", (req, res) => {
  res.json(reviews);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`ZENTRIX running on port ${PORT}`);
});