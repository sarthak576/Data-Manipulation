const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// url encoded password- sarthak%40123
// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://admin:sarthak%40123@cluster0.wcjoqxw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",

  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Middleware
app.use(bodyParser.json());

// Define a schema and model
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model("Item", itemSchema);

// Routes
// Create
app.post("/items", (req, res) => {
  const newItem = new Item(req.body);
  newItem.save((err, item) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(item);
  });
});

// Read
app.get("/items", (req, res) => {
  Item.find({}, (err, items) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(items);
  });
});

// Update
app.put("/items/:id", (req, res) => {
  Item.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, item) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(item);
    }
  );
});

// Delete
app.delete("/items/:id", (req, res) => {
  Item.findByIdAndRemove(req.params.id, (err, item) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(item);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
