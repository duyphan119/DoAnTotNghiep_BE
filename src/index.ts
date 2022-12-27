import express from "express";
const app = express();

app.get("/", (req, res) => res.send("Đây là server của đồ án tốt nghiệp"));

app.listen(8080, () => console.log(`Server is running on port 8080`));
