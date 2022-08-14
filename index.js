const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const savedUsers = [];
const savedExercises = [];

const genId = (length) => {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result; 
}
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const { username } = req.body;
  const newUser = {
    username: username,
    _id: genId(24)
  };
  savedUsers.push(newUser);
  res.json(newUser);
});

app.get("/api/users", (req, res) => {
  res.json(savedUsers);
});

app.post("/api/users/:_id?/exercises", (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  const userById = savedUsers.find((user) => user._id === _id);
  const newExercise = {
    username: userById.username,
    description: description,
    duration: duration,
    date: new Date().toUTCString(),
    _id: userById._id,
  };
  savedExercises.push(newExercise);
  res.json(newExercise);
});

app.get("/api/users/:_id?/logs", (req, res) => {
  const { _id } = req.params;
  const userById = savedUsers.find((user) => user._id === id);
  const listExercises = savedExercises.filter(
    (exercise) => exercise._id === _id
  );
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
