const express = require("express");
const expressEdge = require("express-edge");
const path = require("path");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const connectMongo = require("connect-mongo");
const fileUpload = require("express-fileupload");
const connectFlash = require("connect-flash");
// models import
const Post = require("./database/models/Post");
const User = require("./database/models/User");
const storePost = require("./middleware/storePost");
const sessions = require("./middleware/sessions");
const auth = require("./middleware/auth");
const redirectIfAuthenticated = require("./middleware/redirectIfAuthenticated");

const { request } = require("http");
const { createPost, storePosts, getPostById } = require("./controllers/post");
const {
  registerView,
  register,
  loginView,
  login,
  logout,
} = require("./controllers/auth");
const { aboutPage, postPage, contactPage } = require("./controllers/home");

const app = new express();
mongoose
  .connect("mongodb://localhost:27017/node-blog", { useNewUrlParser: true })
  .then(() => "You are now connected to Mongo!")
  .catch((err) => console.error("Something went wrong", err));
// session
// const mongoStore = new connectMongo(expressSession);
app.use(
  expressSession({
    secret: "secret",
    store: connectMongo.create({
      mongoUrl: "mongodb://localhost:27017/node-blog",
    }),
  })
);
app.use(connectFlash());
app.use(express.static("public"));
app.use(fileUpload());
// express edge
app.use(expressEdge.engine);
app.set("views", __dirname + "/views");

app.use("*", sessions);
// body parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// middleware
app.use("/posts/store", storePost);

// routes
app.get("/", async (req, res) => {
  const posts = await Post.find({});
  res.render("index", { posts });
});
app.get("/auth/login", redirectIfAuthenticated, loginView);
app.post("/users/login", redirectIfAuthenticated, login);
app.get("/auth/register", redirectIfAuthenticated, registerView);
app.post("/users/register", redirectIfAuthenticated, register);
app.get("/users/logout", logout);
app.get("/posts/new", auth, createPost);
app.post("/posts/store", redirectIfAuthenticated, storePosts);
app.get("/posts/:id", getPostById);
app.get("/about", aboutPage);
app.get("/post", postPage);
app.get("/contact", contactPage);

const port = 4000;
app.listen(port, () => {
  console.log("App is running on port", port);
});
