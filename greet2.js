import dotenv from "dotenv";
dotenv.config();
import pgPromise from "pg-promise";

const pgp = pgPromise();
const connectionString =
  process.env.DATABASE_URL ||
  "postgres://greet_lc9j_user:00OQ8P8oZUrXO2RPkzxN6bxtaEMGMk52@dpg-cji98b0cfp5c73a0b1n0-a.oregon-postgres.render.com/greet_lc9j?ssl=true";
const db = pgp(connectionString);

export default function greetMe(myCounter) {
  var patternCheck = /^[a-zA-Z]+$/;
  var greetingsCounter = myCounter || 0;
  var myMessage = "";
  var namesGreeted = {};
  var user;
  async function greetUser(userName, language) {
    if (userName && language) {
      if (patternCheck.test(userName)) {
        if (language === "english") {
          myMessage = "Hello " + userName;
        } else if (language === "setswana") {
          myMessage = "Dumela " + userName;
        } else {
          myMessage = "Molo " + userName;
        }

        try {
          // Check if the user exists in the "users" table
          const existingUser = await db.oneOrNone(
            "SELECT * FROM users WHERE name = $1",
            userName.toLowerCase()
          );

          if (existingUser) {
            // User exists, update the count
            await db.none(
              "UPDATE users SET count = count + 1 WHERE name = $1",
              userName.toLowerCase()
            );
          } else {
            // if User doesn't exist, create a new entry
            await db.none(
              "INSERT INTO users (name, count) VALUES ($1, 1)",
              userName.toLowerCase()
            );
          }
        } catch (error) {
          console.error("Error in greetUser:", error);

          return "An error occurred while processing the request.";
        }
      } else {
        return error(userName, language);
      }
    } else {
      return error(userName, language);
    }
  }

  function error(userName, language) {
    if (!userName && !language) {
      myMessage = "Please enter valid name and choose language";
      return myMessage;
    } else if (!userName) {
      myMessage = "Please enter name";
      return myMessage;
    } else if (userName === "" && language === null) {
      myMessage = "Please enter valid name and choose language";
      return myMessage;
    } else if (!language) {
      myMessage = "Please enter language";
      return myMessage;
    } else if (patternCheck.test(userName) === false) {
      myMessage = "Please enter valid name (letters)";
      return myMessage;
    }
  }

  function namesAndCounter(userName, language) {
    var pattern = /^[a-zA-Z]+$/;
    //when the greet button is pressed check if this user was already greeted before
    //by looking if the userName exists in namesGreeted if not increment this counter and update the screen
    if (namesGreeted[userName] === undefined) {
      if (pattern.test(userName.toLowerCase()) && language !== null) {
        greetingsCounter++;
      }
      //add an entry for the user that was greeted in the Object Map
      namesGreeted[userName.toLowerCase()] = 1;
    } else {
      // update the counter for a specific username
      namesGreeted[userName.toLowerCase()]++;
    }
  }
  function setUser(name) {
    user = name;
  }

  function getUser() {
    return user;
  }
  function getCounter() {
    return greetingsCounter;
  }
  function getNamesGreeted() {
    return namesGreeted;
  }
  function getMessage() {
    return myMessage;
  }
  function reset() {
    greetingsCounter = 0; // Reset the counter
    myMessage = ""; // Reset the message
    namesGreeted = {}; // Clear the namesGreeted object
  }
  function getGreetCountForUser(userName) {
    return namesGreeted[userName.toLowerCase()] || 0;
  }

  return {
    greetUser,
    setUser,
    getUser,
    namesAndCounter,
    getCounter,
    getNamesGreeted,
    error,
    getMessage,
    reset,
    getGreetCountForUser,
  };
}
