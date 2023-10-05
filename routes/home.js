const homeRoute = (dataService, greetService) => {
  const route = async (req, res) => {
    try {
      const counts = await dataService.getCounter();
      setTimeout(() => {
        greetService.reset(); // Clear the message
      }, 3000);
      res.render("index", {
        counter: counts,
        message: greetService.getMessage(),
      });
    } catch (error) {
      console.error("Error handling root route:", error);
    }
  };

  return {
    route,
  };
};

export default homeRoute;
