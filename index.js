import express from "express";
import exphbs from "express-handlebars";

import greetMe from "./greet2.js";
import flash from "express-flash";
import session from "express-session";
const app = express(); //instantiate app

const greet = greetMe();
const handlebarSetup = exphbs.engine({
  partialsDir: "./views/partials",
  viewPath: "./views",
  layoutsDir: "./views/layouts",
});
app.engine("handlebars", handlebarSetup); //configure express as middleware
app.set("view engine", "handlebars");

app.set("views", "./views");
app.use(express.static("public")); // middleware to make public folder visible

app.use(express.urlencoded({ extended: false })); // set up body parser to create middleware for when settings are updated

app.use(express.json()); // To handle JSON data

// initialise session middleware - flash-express depends on it
app.use(
  session({
    secret: "Please enter a valid name(letters)",
    resave: false,
    saveUninitialized: true,
  })
);

// initialise the flash middleware
app.use(flash());

app.get("/", function (req, res) {
  //set default root
  res.render("index", {
    message: greet.getMessage(),
    counter: greet.getCounter(),
    greet,
  });
});

app.post("/details", function (req, res) {
  if (!req.body.name) {
    req.flash("error", "Please enter a name"); // Set a flash message for no username
  }

  greet.greetUser(req.body.name, req.body.languagetype);
  greet.namesAndCounter(req.body.name, req.body.languagetype);
  res.redirect("/");
});
app.get("/greeted", function (req, res) {
  const greetedNames = Object.keys(greet.getNamesGreeted()); // to get object keys which are names entered keys
  res.render("greeted", { namesGreeted: greetedNames });
  console.log(greetedNames);
});
app.get("/counter/:userName", function (req, res) {
  const userName = req.params.userName.toLowerCase();
  const greetCount = greet.getGreetCountForUser(userName);

  res.render("counter", { userName, greetCount });
});

app.get("/reset", function (req, res) {
  greet.reset(); // Call the reset function to clear counter and message
  res.redirect("/");
});
const PORT = process.env.PORT || 3009;

app.listen(PORT, function () {
  console.log("App started at port", PORT);
});
