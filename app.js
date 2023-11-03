const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
require("dotenv/config");

const app = express();

app.use(bodyParser.json({ limit: "30mb", type: "application/json" }));
app.use(cors());

app.get("/helloFriend", (req, res) => {
  res.send("Hallo Freund");
});

const Movie = require("./models/Movie");

app.get("/list", async (req, res) => {
  try {
    const movieData = await Movie.find();
    res.send({ movies: movieData });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.post("/insert", async (req, res) => {
  try {
    const { title, category, user } = req.body;

    if (!title || !category || !user) {
      res.status(400).send({ error: "All fields are required" });
    } else {
      const newMovie = new Movie({
        title,
        category,
        user,
      });
      await newMovie.save();
      res.send({ msg: "Successfull added movie" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e });
  }
});

app.use(express.static('frontend'));

mongoose.connect(process.env.DB_CONNECTION);

app.listen(process.env.PORT, () => {
  console.log(`Application running on port ${process.env.PORT}`);
});
