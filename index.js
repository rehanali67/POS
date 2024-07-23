const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const authRouter = require("./router/authRouter");
const productRouter = require("./router/productRouter");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Adjusted path

// Routes
app.use("/auth", authRouter);
app.use("/api/products", productRouter); // Ensure this line is here

// Serve the starting page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'starting-page.html'));
});

// Serve other HTML files
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/pos", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "profile.html"));
});

// Connect to MongoDB
const mongoURI = "mongodb+srv://RehanAli:Reshan522@cluster0.1kjcbox.mongodb.net/yourDatabaseName";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
