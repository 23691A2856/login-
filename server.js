import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (so index.html, results_2024.html, etc. are available)
app.use(express.static(path.resolve()));

// ─────────────────────────────────────────────
// 1. Home Route (serve index.html)
// ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.sendFile(path.resolve("index.html"));
});

// ─────────────────────────────────────────────
// 2. Get UG Results (May 2024 onwards)
// ─────────────────────────────────────────────
app.get("/results/ug/2024", (req, res) => {
  fs.readFile("./results/results_2024.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error loading results");

    res.send(JSON.parse(data));
  });
});

// ─────────────────────────────────────────────
// 3. Search student result by hall ticket number
// ─────────────────────────────────────────────
app.post("/results/search", (req, res) => {
  const { hallticket } = req.body;

  fs.readFile("./results/results_2024.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Cannot read results");

    const results = JSON.parse(data);
    const student = results.find((s) => s.hallticket === hallticket);

    if (!student) {
      return res.status(404).send({ message: "Student not found ❌" });
    }

    res.send(student);
  });
});

// ─────────────────────────────────────────────
// Server Start
// ─────────────────────────────────────────────
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
