import assert from "assert";
import greetMe from "../greet2.js";

describe("set and retrieve user names", function () {
  it("It should set userName", function () {
    let Usertest = greetMe();
    Usertest.setUser("xola");
    assert.equal("xola", Usertest.getUser());
  });
  it("It should set userName", function () {
    let Usertest = greetMe();
    Usertest.setUser("jess");
    assert.equal("jess", Usertest.getUser());
  });
  it("It should set userName", function () {
    let Usertest = greetMe();
    Usertest.setUser("lisa");
    assert.equal("lisa", Usertest.getUser());
  });
});
describe("Testing Greetings in different languages", function () {
  it("It should greet user in isiXhosa", function () {
    let Usertest = greetMe();

    assert.equal("Molo xola", Usertest.greetUser("xola", "isixhosa"));
  });
  it("It should greet user in English", function () {
    let Usertest = greetMe();

    assert.equal("Hello alice", Usertest.greetUser("alice", "english"));
  });
  it("It should greet user in Setswana", function () {
    let Usertest = greetMe();

    assert.equal("Dumela thabo", Usertest.greetUser("thabo", "setswana"));
  });
});

describe("Testing User Errors", function () {
  it("It should not greet empty name", function () {
    let Usertest = greetMe();

    assert.equal("Please enter name", Usertest.error("", "isixhosa"));
  });

  it("It should not greet numbers", function () {
    let Usertest = greetMe();

    assert.equal(
      "Please enter valid name(letters)",
      Usertest.error(99, "isixhosa")
    );
  });

  it("It should not greet names that contain numbers", function () {
    let Usertest = greetMe();

    assert.equal(
      "Please enter valid name(letters)",
      Usertest.error("mm99", "isixhosa")
    );
  });

  it("It should not greet no language", function () {
    let Usertest = greetMe();

    assert.equal("Please enter language", Usertest.error("Nora", null));
  });
  it("It should not greet no name and no language", function () {
    let Usertest = greetMe();

    assert.equal(
      "Please enter valid name and choose language",
      Usertest.error("", null)
    );
  });
});

describe("Counting Greetings in different languages", function () {
  let test = greetMe();
  it("It should not count names that contain numbers", function () {
    test.namesAndCounter("mm99", "isixhosa");

    assert.equal(0, test.getCounter());
  });
  it("It should not count names that contain numbers", function () {
    let test = greetMe();
    test.namesAndCounter("mm", "isixhosa");
    test.namesAndCounter("mm56", "isixhosa");

    assert.equal(1, test.getCounter());
  });

  it("It should not count empty names", function () {
    let test = greetMe();
    test.namesAndCounter("", "isixhosa");

    assert.equal(0, test.getCounter());
  });

  it("It should return correct count for 4 names", function () {
    let test2 = greetMe();

    test2.namesAndCounter("lisa", "isixhosa");
    test2.namesAndCounter("james", "isixhosa");
    test2.namesAndCounter("refiloe", "isixhosa");
    test2.namesAndCounter("kyle", "isixhosa");
    test2.namesAndCounter("", "isixhosa");

    assert.equal(4, test2.getCounter());
  });

  it("Counter should only increment once for the same person", function () {
    let test2 = greetMe();

    test2.namesAndCounter("lisa", "isixhosa");
    test2.namesAndCounter("lisa", "isixhosa");

    assert.equal(1, test2.getCounter());
  });
});
