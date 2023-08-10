export default function greetMe(myCounter) {
  var patternCheck = /^[a-zA-Z]+$/;
  var greetingsCounter = myCounter || 0;
  var myMessage = "";
  var namesGreeted = {};
  var user;
  function greetUser(userName, language) {
    // if (!userName && language) {
    //   return "Please enter Name and Language";
    // }
    if (userName && language) {
      if (patternCheck.test(userName)) {
        if (language === "english") {
          myMessage = "Hello " + userName;
          return myMessage;
        } else if (language === "setswana") {
          myMessage = "Dumela " + userName;
          return myMessage;
        } else {
          myMessage = "Molo " + userName;
          return myMessage;
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
  };
}
