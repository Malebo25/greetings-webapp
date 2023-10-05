const GreetedRoute = (dataService) => {
  const route = async (req, res) => {
    try {
      const greetedNames = await dataService.getNamesGreeted();
      res.render("greeted", { namesGreeted: greetedNames });
    } catch (error) {
      console.error("Error handling /greeted route:", error);
    }
  };

  return {
    route,
  };
};

export default GreetedRoute;
