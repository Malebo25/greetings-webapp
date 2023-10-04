import assert from "assert";
import query from "../service/query.js";
import pgPromise from "pg-promise";
import dotenv from "dotenv";

dotenv.config();

const testDATABASE_URL =
  "postgres://extzsmya:fsr2rClszPPiJpUYFL7My11UHxWR8t7Y@flora.db.elephantsql.com/extzsmya";
const connectionString = process.env.testDATABASE_URL || testDATABASE_URL;
const db = pgPromise()(connectionString);

const data = query(db);

// Test cases for insertIntoTable function
it("should insert a new user with count 1", async () => {
  try {
    await data.insertIntoTable("Charlie", "setswana");

    const userCount = await db.one(
      "SELECT count FROM users WHERE name = 'Charlie'"
    );
    assert.deepStrictEqual(userCount.count, 1);
  } catch (error) {
    console.log(error);
    throw error;
  }
});

it("should increment the count for an existing user", async () => {
  await data.insertIntoTable("Alice", "english");
  await data.insertIntoTable("Alice", "english");
  const userCount = await db.one(
    "SELECT count FROM users WHERE name = 'Alice'"
  );
  assert.strictEqual(userCount.count, 2);
});

// Add more test cases for other functions

// Cleanup after tests
after(async () => {
  // You can drop the test tables and perform any other cleanup here
  await db.none("DROP TABLE IF EXISTS users");
});

// it("should increment the count for an existing user", async () => {
//   await data.insertIntoTable("Alice", "english");
//   await data.insertIntoTable("Alice", "english");
//   const userCount = await db.one(
//     "SELECT count FROM users WHERE name = 'Alice'"
//   );
//   assert.strictEqual(userCount.count, 2);
// });

// // Test cases for getCounter function
// it("should return the total count of users", async () => {
//   const counter = await data.getCounter();
//   assert.strictEqual(counter, 0); // There are two users in the test data
// });

// // Test cases for getNamesGreeted function
// it("should return an array of greeted names", async () => {
//   const greetedNames = await data.getNamesGreeted();
//   assert.deepEqual(greetedNames, []);
// });

// // Test cases for getGreetCountForUser function
// it("should return the greet count for an existing user", async () => {
//   const count = await data.getGreetCountForUser("Alice");
//   assert.strictEqual(count, 3);
// });

// it("should return 0 for a user that does not exist", async () => {
//   const count = await data.getGreetCountForUser("Eve");
//   assert.strictEqual(count, 0);
// });

// // Test cases for reset function
// it("should delete all records from the 'users' table", async () => {
//   await data.reset();
//   const counter = await data.getCounter();
//   assert.strictEqual(counter, 0); // No users should remain after reset
// });
