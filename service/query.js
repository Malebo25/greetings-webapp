export default function query(db) {
  var patternCheck = /^[a-zA-Z]+$/;

  async function insertIntoTable(userName, lang) {
    if (patternCheck.test(userName) && lang) {
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
    }
  }
  async function getCounter() {
    return await db.oneOrNone("SELECT COUNT (count) FROM users");
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
        "SELECT count FROM users WHERE name = $1",
        userName.toLowerCase()
      );

      if (result) {
        return result.count || 0; // Return the sum of counts or 0 if there's no result
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
      // Deleting  records from the 'users' table
      await db.none("DELETE FROM users");
    } catch (error) {
      console.error("Error in reset:", error);
    }
  }
  return {
    reset,
    getGreetCountForUser,
    getNamesGreeted,
    getCounter,
    insertIntoTable,
  };
}
