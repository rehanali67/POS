const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRouter = require("./router/authRouter");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

// Routes
app.use("/auth", authRouter);

// Serve the starting page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'starting-page.html'));
});

// Serve other HTML files
app.get("/home.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.get("/pos.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/profile.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "profile.html"));
});
const products = [
  { name: 'Product 1', price: 10000.00 },
  { name: 'Product 2', price: 20000.00 },
  { name: 'Product 3', price: 300000.00 }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

// Connect to MongoDB
const mongoURI = "mongodb+srv://RehanAli:Reshan522@cluster0.1kjcbox.mongodb.net/";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/auth", authRouter);



 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
