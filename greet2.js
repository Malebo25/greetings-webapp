export default function greetMe() {
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
      }
    }
  }

  function error(userName, language) {
    if (!userName && !language) {
      myMessage = "Please enter valid name and choose language";
      return myMessage;
    } else if (!userName) {
      // myMessage = "Please enter name";
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

  function setUser(name) {
    user = name;
  }

  function getUser() {
    return user;
  }

  function getMessage() {
    return myMessage;
  }

  async function reset() {
    greetingsCounter = 0;
    myMessage = "";
  }

  return {
    greetUser,
    setUser,
    getUser,
    error,
    getMessage,
    reset,
  };
}
