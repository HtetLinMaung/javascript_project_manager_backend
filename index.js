const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/projects", require("./routes/api/projects"));
app.use("/api/tasks", require("./routes/api/tasks"));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
