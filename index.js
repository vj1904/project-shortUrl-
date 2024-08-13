const express = require("express");
const ejs = require("ejs");
const path = require("path");
const URL = require("./models/url");
const cookieParser = require("cookie-parser");
const { restrictToLoggediUserOnly, checkAuth } = require("./middlewares/auth");
const { connectMongoDB } = require("./connect");
const app = express();
const PORT = 3000;

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

connectMongoDB("mongodb://127.0.0.1:27017/short-url").then(
  console.log("connected to mongoDb")
);

app.set("views", path.resolve("./views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictToLoggediUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

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
