const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

app.get("/", (req, res) => {
  res.send("Server is running!");
});


app.get("/students", async (req, res) => {
  const students = await Student.find();

  res.json(students);
});


app.post("/students", async (req, res) => {
  const student = new Student({
    name: req.body.name,
    course: req.body.course,
    age: req.body.age,
  });

  await student.save();

  res.status(201).json(student);
});


app.put("/students/:id", async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      course: req.body.course,
      age: req.body.age,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!student) {
    return res.status(404).json({ message: "Student not found." });
  }

  res.json(student);
});


app.delete("/students/:id", async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found." });
  }

  res.json({ message: "Student deleted." });
});


app.use((error, req, res, next) => {
  console.error(error.message);

  if (res.headersSent) {
    return next(error);
  }

  const status =
    error.name === "CastError" || error.name === "ValidationError"
      ? 400
      : 500;

  res.status(status).json({
    message:
      status === 400
        ? "Invalid student data or ID."
        : "The server could not complete the request.",
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});