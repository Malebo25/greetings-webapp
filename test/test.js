import assert from "assert";
import query from "../service/query.js";
import pgPromise from "pg-promise";
import "dotenv/config";

const pgp = pgPromise();

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://greet_lc9j_user:00OQ8P8oZUrXO2RPkzxN6bxtaEMGMk52@dpg-cji98b0cfp5c73a0b1n0-a.oregon-postgres.render.com/greet_lc9j?ssl=true";
const db = pgp(connectionString);

const data = query(db);

// Test cases for insertIntoTable function
it("should insert a new user with count 1", async () => {
  await data.insertIntoTable("Charlie");
  const userCount = await db.one(
    "SELECT count FROM users WHERE name = 'Charlie'"
  );
  assert.strictEqual(userCount.count, 1);
});

it("should increment the count for an existing user", async () => {
  await data.insertIntoTable("Alice");
  const userCount = await db.one(
    "SELECT count FROM users WHERE name = 'Alice'"
  );
  assert.strictEqual(userCount.count, 4);
});

// Test cases for getCounter function
it("should return the total count of users", async () => {
  const counter = await data.getCounter();
  assert.strictEqual(counter, 2); // There are two users in the test data
});

// Test cases for getNamesGreeted function
it("should return an array of greeted names", async () => {
  const greetedNames = await data.getNamesGreeted();
  assert.deepEqual(greetedNames, ["Alice", "Bob", "Charlie"]);
});

// Test cases for getGreetCountForUser function
it("should return the greet count for an existing user", async () => {
  const count = await data.getGreetCountForUser("Alice");
  assert.strictEqual(count, 3);
});

it("should return 0 for a user that does not exist", async () => {
  const count = await data.getGreetCountForUser("Eve");
  assert.strictEqual(count, 0);
});

// Test cases for reset function
it("should delete all records from the 'users' table", async () => {
  await data.reset();
  const counter = await data.getCounter();
  assert.strictEqual(counter, 0); // No users should remain after reset
});
