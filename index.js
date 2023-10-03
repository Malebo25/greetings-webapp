import dotenv from "dotenv";
dotenv.config();

import express from "express";
import exphbs from "express-handlebars";
import query from "./service/query.js";
import greetMe from "./greet2.js";
import flash from "express-flash";
import session from "express-session";
import pgPromise from "pg-promise";

const pgp = pgPromise();
const app = express(); //instantiate app

const connectionString =
  "postgres://greet_lc9j_user:00OQ8P8oZUrXO2RPkzxN6bxtaEMGMk52@dpg-cji98b0cfp5c73a0b1n0-a.oregon-postgres.render.com/greet_lc9j?ssl=true";
const db = pgp(connectionString);
const data = query(db);
const Counter = 0;
const greet = greetMe(db);
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

app.get("/", async function (req, res) {
  //set default root
  const counts = await data.getCounter();
  setTimeout(() => {
    greet.reset(); // Clear the message
  }, 3000);
  res.render("index", {
    counter: counts,
    message: greet.getMessage(),
  });
});

app.post("/details", function (req, res) {
  const languageChoice = req.body.languagetype;
  const nameEntry = req.body.name;

  if (!languageChoice && !nameEntry) {
    req.flash("error", "Please choose a language and enter valid name");
  } else if (nameEntry === "") {
    req.flash("error", "Please enter a name"); // Set a flash message for no username
  } else if (!languageChoice) {
    req.flash("error", "Please choose a language");
  } else {
    data.insertIntoTable(nameEntry, languageChoice);
    greet.greetUser(nameEntry, languageChoice);
  }

  res.redirect("/");
});

app.get("/greeted", async function (req, res) {
  try {
    const greetedNames = await data.getNamesGreeted(); // Wait for the Promise to resolve
    console.log(greetedNames); // Now you can log the resolved data

    res.render("greeted", { namesGreeted: greetedNames });
  } catch (error) {
    console.error("Error in /greeted route:", error);
    res.status(500).send("An error occurred while fetching greeted names.");
  }
});

app.get("/counter/:userName", async function (req, res) {
  const userName = req.params.userName.toLowerCase();
  const greetCount = await data.getGreetCountForUser(userName); // Await the result

  res.render("counter", { userName, greetCount });
});

app.get("/reset", function (req, res) {
  // Call the reset function to clear counter and message
  data.reset();
  greet.reset();

  res.redirect("/");
});
const PORT = process.env.PORT || 3005;
app.listen(PORT, function () {
  console.log("App started at port", PORT);
});
