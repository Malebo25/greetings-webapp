import assert from "assert";
import greetMe from "../greet2.js";
import pgp from "pg-promise";

// Create a test database connection
const db = pgp()({
  database: "test_database", // Change to your test database name
});

// Initialize the greetMe module with the test database
const greet = greetMe(db);

describe("GreetMe Module", () => {
  // Increase the timeout for before and after hooks
  this.timeout(5000); // Adjust the timeout as needed

  // Before running tests, create a test table and insert test data
  before(async () => {
    // Create a test table if it doesn't exist
    await db.none(`
      CREATE TABLE IF NOT EXISTS users (
        name TEXT PRIMARY KEY,
        count INT
      );
    `);

    // Insert some initial test data
    await db.none(`
      INSERT INTO users (name, count) VALUES
      ('Alice', 3),
      ('Bob', 2);
    `);
  });

  // After running tests, drop the test table
  after(async () => {
    // Drop the test table
    await db.none("DROP TABLE IF EXISTS users;");
  });

  // Test cases
  it("should greet a user in English", async () => {
    const message = await greet.greetUser("Alice", "english");
    assert.strictEqual(message, "Hello Alice");
  });

  it("should greet a user in Setswana", async () => {
    const message = await greet.greetUser("Bob", "setswana");
    assert.strictEqual(message, "Dumela Bob");
  });

  it("should increment the counter when greeting an existing user", async () => {
    await greet.greetUser("Alice", "english");
    const counter = await greet.getGreetCountForUser("Alice");
    assert.strictEqual(counter, 4);
  });

  it("should create a new user entry when greeting a new user", async () => {
    await greet.greetUser("Charlie", "english");
    const counter = await greet.getGreetCountForUser("Charlie");
    assert.strictEqual(counter, 1);
  });

  it("should return a list of greeted names", async () => {
    const greetedNames = await greet.getNamesGreeted();
    assert.deepEqual(greetedNames, ["Alice", "Bob", "Charlie"]);
  });

  it("should reset the counter and message", async () => {
    await greet.reset();
    const counter = await greet.getCounter();
    const message = await greet.getMessage();
    assert.strictEqual(counter, 0);
    assert.strictEqual(message, "");
  });
});
