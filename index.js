import dotenv from "dotenv";
dotenv.config();

import express from "express";
import exphbs from "express-handlebars";

import greetMe from "./greet2.js";
import flash from "express-flash";
import session from "express-session";
import pgPromise from "pg-promise";

const pgp = pgPromise();
const app = express(); //instantiate app

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://greet_lc9j_user:00OQ8P8oZUrXO2RPkzxN6bxtaEMGMk52@dpg-cji98b0cfp5c73a0b1n0-a.oregon-postgres.render.com/greet_lc9j?ssl=true";
const db = pgp(connectionString);
const Counter = 0;
const greet = greetMe(Counter, db);
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

  res.redirect("/");
});

app.get("/greeted", async function (req, res) {
  try {
    const greetedNames = await greet.getNamesGreeted(); // Wait for the Promise to resolve
    console.log(greetedNames); // Now you can log the resolved data

    res.render("greeted", { namesGreeted: greetedNames });
  } catch (error) {
    console.error("Error in /greeted route:", error);
    res.status(500).send("An error occurred while fetching greeted names.");
  }
});

app.get("/counter/:userName", async function (req, res) {
  const userName = req.params.userName.toLowerCase();
  const greetCount = await greet.getGreetCountForUser(userName); // Await the result

  res.render("counter", { userName, greetCount });
});

app.get("/reset", function (req, res) {
  greet.reset(); // Call the reset function to clear counter and message
  res.redirect("/");
});
const PORT = process.env.PORT || 3005;
app.listen(PORT, function () {
  console.log("App started at port", PORT);
});
