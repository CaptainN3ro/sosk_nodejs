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

app.get("/listHTML", async (req, res) => {
  try {
    const movieData = await Movie.find();
    const moviesHTML = generateMoviesHTML(movieData);
    res.send(moviesHTML);
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

function generateMoviesHTML(movies) {
  const tableRows = movies.map((movie) => {
    return `<tr>
      <td>${movie.title}</td>
      <td>${movie.category}</td>
      <td>${movie.user}</td>
    </tr>`;
  });

  const moviesTable = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }

          table, th, td {
            border: 1px solid #ddd;
          }

          th, td {
            padding: 15px;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <h1> Movie List</h1>
        <table>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>User</th>
          </tr>
          ${tableRows.join('')}
        </table>
      </body>
    </html>
  `;

  return moviesTable;
}


mongoose.connect(process.env.DB_CONNECTION);

app.listen(process.env.PORT, () => {
  console.log(`Application running on port ${process.env.PORT}`);
});
