const DetailsRoute = (dataService, greetService, patternCheck) => {
  const route = async (req, res) => {
    try {
      const languageChoice = req.body.languagetype;
      const nameEntry = req.body.name;

      if (!languageChoice && !nameEntry) {
        req.flash("error", "Please choose a language and enter a valid name");
      } else if (nameEntry === "") {
        req.flash("error", "Please enter a name"); // Set a flash message for no username
      } else if (!languageChoice) {
        req.flash("error", "Please choose a language");
      } else if (!patternCheck.test(nameEntry)) {
        req.flash("error", "Please enter a valid name (letters)");
      } else {
        await dataService.insertIntoTable(nameEntry, languageChoice);
        greetService.greetUser(nameEntry, languageChoice);
      }

      res.redirect("/");
    } catch (error) {
      console.error("Error handling /details route:", error);
    }
  };

  return {
    route,
  };
};

export default DetailsRoute;
