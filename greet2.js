export default function greetMe(db) {
  var patternCheck = /^[a-zA-Z]+$/;
  var greetingsCounter = 0;
  var myMessage = "";

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

  // async function namesAndCounter(userName, language) {
  //   var pattern = /^[a-zA-Z]+$/;
  //   if (pattern.test(userName.toLowerCase()) && language !== null) {
  //     try {
  //       // Check if the user exists in the "users" table
  //       const existingUser = await db.oneOrNone(
  //         "SELECT * FROM users WHERE name = $1",
  //         userName.toLowerCase()
  //       );

  //       if (existingUser) {
  //         // User exists, update the count
  //         await db.none(
  //           "UPDATE users SET count = count + 1 WHERE name = $1",
  //           userName.toLowerCase()
  //         );
  //       } else {
  //         // If User doesn't exist, create a new entry
  //         await db.none(
  //           "INSERT INTO users (name, count) VALUES ($1, 1)",
  //           userName.toLowerCase()
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error in namesAndCounter:", error);
  //     }
  //   }
  // }
  function setUser(name) {
    user = name;
  }

  function getUser() {
    return user;
  }
  function getCounter() {
    try {
      // Fetch the total number of unique greeted names from the database
      const result = await db.one(
        "SELECT COUNT(*) FROM users"
      );

      return result.count || 0;
    } catch (error) {
      console.error("Error in getCounter:", error);
      return 0;
    }
  }

  function getMessage() {
    return myMessage;
  }
  async function getNamesGreeted() {
    try {
      // Fetch distinct greeted names from the database
      const result = await db.any("SELECT DISTINCT name FROM users");
      const greetedNames = result.map((row) => row.name);
      return greetedNames;
    } catch (error) {
      console.error("Error in getNamesGreeted:", error);
      return [];
    }
  }

  async function getGreetCountForUser(userName) {
    try {
      // Fetch the greeting count for the  user from the database
      const result = await db.oneOrNone(
        "SELECT SUM(count) FROM users WHERE name = $1",
        userName.toLowerCase()
      );

      if (result) {
        return result.sum || 0; // Return the sum of counts or 0 if there's no result
      } else {
        return 0; // Return 0 if the user is not found
      }
    } catch (error) {
      console.error("Error in getGreetCountForUser:", error);
      return 0;
    }
  }

  async function reset() {
    try {
      // Reseting the counter and message
      greetingsCounter = 0;
      myMessage = "";

      // Deleting  records from the 'users' table
      await db.none("DELETE FROM users");
    } catch (error) {
      console.error("Error in reset:", error);
    }
  }

  return {
    greetUser,
    setUser,
    getUser,
    getCounter,
    getNamesGreeted,
    error,
    getMessage,
    reset,
    getGreetCountForUser,
  };
}
