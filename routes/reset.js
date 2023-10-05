const Reset = (dataService, greetService) => {
  const reset = async (req, res) => {
    try {
      await dataService.reset();

      greetService.reset();

      res.redirect("/");
    } catch (error) {
      console.error("Error resetting data:", error);
    }
  };

  return {
    reset,
  };
};
export default Reset;
