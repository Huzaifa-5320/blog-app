import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS and Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// In-memory posts array
let posts = [];

let defaultTasks = ["Buy groceries", "Read book"];
let workTasks = ["Email client", "Prepare report"];


// Routes
app.get("/", (req, res) => {
  res.render("home.ejs", { posts: posts });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = {
    id: uuidv4(),
    title: req.body.postTitle,
    content: req.body.postBody
  };
  posts.push(post);
  res.redirect("/");
});

app.get("/post/:id", (req, res) => {
//   const post = posts[req.params.id];
  const post = posts.find(p => p.id === req.params.id);
//   console.log(req.params.id);
  if (post) {
    res.render("post", { post: post, id: req.params.id });
  } else {
    res.status(404).send("Post not found");
  }
});

// Edit and Delete routes will be added later

// Show the edit form
app.get("/edit/:id", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    res.render("edit", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/edit/:id", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    post.title = req.body.postTitle;
    post.content = req.body.postBody;
    res.redirect("/post/" + post.id);
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const postIndex = posts.findIndex(p => p.id === id);

  if (postIndex !== -1) {
    posts.splice(postIndex, 1); //  it removes 1 post at index postIndex from the posts array.
    res.redirect("/");          // Redirect to home page
  } else {
    res.status(404).send("Post not found");
  }
});

app.get("/list", (req, res) => {
  const listType = req.query.type || "default";
  let tasks;

  if (listType === "work") {
    tasks = workTasks;
  } else {
    tasks = defaultTasks;
  }

  res.render("list", { tasks: tasks, type: listType });
});

app.post("/add", (req, res) => {
  const task = req.body.task;
  const type = req.body.type;

  if (type === "work") {
    workTasks.push(task);
    res.redirect("/list?type=work");
  } else {
    defaultTasks.push(task);
    res.redirect("/list");
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
