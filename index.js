const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const savedUsers = [];
const savedExercises = [];

const genId = (length) => {
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const { username } = req.body;
  const newUser = {
    username: username,
    _id: genId(24),
    // _id: savedUsers.length + 1,
    exercises: [],
  };
  savedUsers.push(newUser);
  res.json({ username: newUser.username, _id: newUser._id });
});

app.get("/api/users", (req, res) => {
  res.json(savedUsers);
});

app.post("/api/users/:_id?/exercises", (req, res) => {
  const { _id } = req.params;
  const userById = savedUsers.find((user) => user._id == _id);
  const { description, duration } = req.body;

  const dateBo = (new Date(req.body.date ? req.body.date : Date.now()))
  

  isNaN(parseInt(duration))
    ? res.status(400).send("Duration must be a number")
    : null;

  const newExercise = {
    description: description,
    duration: parseInt(duration),
    date: dateBo,
  };
  userById.exercises.push(newExercise);
  res.json({
    username: userById.username,
    _id: userById._id,
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date.toDateString(),
  });
});

app.get("/api/users/:_id?/logs", (req, res) => {
  console.log(req);
  const { _id } = req.params;
  const userById = savedUsers.find((user) => user._id == _id);
  const listExercises = userById.exercises.map((exercise) => {
    return {
      duration: exercise.duration,
      date: exercise.date.toDateString(),
      description: exercise.description,
    }});
    const log = {
    username: userById.username,
    count: listExercises.length,
    _id: userById._id,
    log: listExercises,
  };
  res.json(log);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
