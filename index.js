const express = require("express");
const ejs = require("ejs");
const path = require("path");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const staticRoute = require("./routes/staticRouter");
const { connectMongoDB } = require("./connect");
const app = express();
const PORT = 3000;

connectMongoDB("mongodb://127.0.0.1:27017/short-url").then(
  console.log("connected to mongoDb")
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("views", path.resolve("./views"));
app.set("view engine", "ejs");
app.use("/url", urlRoute);
app.use("/", staticRoute);

app.get("/urls/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});
app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
