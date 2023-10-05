const userCounterRoute = (dataService) => {
  const route = async (req, res) => {
    try {
      const userName = req.params.userName.toLowerCase();
      const greetCount = await dataService.getGreetCountForUser(userName);

      res.render("counter", { userName, greetCount });
    } catch (error) {
      console.error("Error handling /counter route:", error);
    }
  };

  return {
    route,
  };
};
export default userCounterRoute;
