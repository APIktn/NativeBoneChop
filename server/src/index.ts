import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Server OK 🚀" });
});

app.listen(3000, () => {
  console.log("Server running on 3000");
});
