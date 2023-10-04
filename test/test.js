import assert from "assert";
import query from "../service/query.js";
import pgPromise from "pg-promise";
import dotenv from "dotenv";
dotenv.config();
const pgp = pgPromise();

const testDATABASE_URL =
  "postgres://extzsmya:fsr2rClszPPiJpUYFL7My11UHxWR8t7Y@flora.db.elephantsql.com/extzsmya";
const connectionString = testDATABASE_URL;
const db = pgp(connectionString);

const data = query(db);

const clearUsersTable = async () => {
  try {
    await db.none("DELETE FROM users");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Before running tests, clear the users table
before(async () => {
  await clearUsersTable();
});

// Test cases for insertIntoTable function
it("should insert a new user with count 1", async () => {
  try {
    await data.insertIntoTable("Charlie", "setswana");
    console.log("hi");
    const userCount = await db.oneOrNone(
      "SELECT count FROM users WHERE LOWER(name) = $1",
      "charlie"
    );
    console.log(userCount);
    assert.deepStrictEqual(userCount.count, 1);
  } catch (error) {
    console.log(error);
    throw error;
  }
});

it("should increment the count for an existing user", async () => {
  try {
    await data.insertIntoTable("Alice", "english");
    await data.insertIntoTable("alice", "english");
    const userCount = await db.oneOrNone(
      "SELECT count FROM users WHERE name = 'alice'"
    );

    assert.deepStrictEqual(userCount.count, 2);
  } catch (error) {
    console.log(error);
    throw error;
  }
});

//Test cases for getCounter function
it("should return the total count of users", async () => {
  const counter = await data.getCounter();
  assert.deepStrictEqual(Number(counter.count), 2);
});

//Test cases for getNamesGreeted function
it("should return an array of greeted names", async () => {
  const greetedNames = await data.getNamesGreeted();

  assert.deepEqual(greetedNames.sort(), ["alice", "charlie"].sort());
});

// // Test cases for getGreetCountForUser function
it("should return the greet count for an existing user", async () => {
  const count = await data.getGreetCountForUser("Alice");
  assert.strictEqual(count, 2);
});

it("should return 0 for a user that does not exist", async () => {
  const count = await data.getGreetCountForUser("Eve");
  assert.strictEqual(count, 0);
});

// Test cases for reset function
it("should delete all records from the 'users' table", async () => {
  await data.reset();
  const counter = await data.getCounter();
  assert.strictEqual(Number(counter.count), 0); // No users should remain after reset
});
