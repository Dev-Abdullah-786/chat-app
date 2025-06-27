const httpServer = require("./app");

httpServer.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
