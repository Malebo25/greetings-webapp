import dotenv from "dotenv";
dotenv.config();

import express from "express";
import exphbs from "express-handlebars";
import query from "./service/query.js";
import greetMe from "./greet2.js";
import flash from "express-flash";
import session from "express-session";
import pgPromise from "pg-promise";

//routes
import Reset from "./routes/reset.js";
import userCounterRoute from "./routes/userName.js";
import GreetedRoute from "./routes/greeted.js";
import DetailsRoute from "./routes/details.js";
import homeRoute from "./routes/home.js";

const pgp = pgPromise();
const app = express(); //instantiate app
var patternCheck = /^[a-zA-Z]+$/;

const connectionString =
  "postgres://greet_lc9j_user:00OQ8P8oZUrXO2RPkzxN6bxtaEMGMk52@dpg-cji98b0cfp5c73a0b1n0-a.oregon-postgres.render.com/greet_lc9j?ssl=true";
const db = pgp(connectionString);
const data = query(db);

const greet = greetMe(db);

//instantiate routes

const reset = Reset(data, greet);
const userNameCountRoute = userCounterRoute(data);
const greetedRoute = GreetedRoute(data);
const detailsRoute = DetailsRoute(data, greet, patternCheck);
const homeroute = homeRoute(data, greet);

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

app.get("/", homeroute.route);
app.post("/details", detailsRoute.route);
app.get("/greeted", greetedRoute.route);
app.get("/counter/:userName", userNameCountRoute.route);
app.get("/reset", reset.reset);

const PORT = process.env.PORT || 3005;
app.listen(PORT, function () {
  console.log("App started at port", PORT);
});
