const app = require("express")();
const bodyParser = require("body-parser");
const passport = require('passport');

const configApp = require("../configs/indexApp");
const sequelize = require("../configs/db");

const userRouter = require("./routes/userRoute/router");

sequelize
  .authenticate()
  .then(() => {
    app.use(bodyParser.json());

    app.use("/api", userRouter);

    app.listen(configApp.port, () =>
      console.log(`Listen on port: ${configApp.port}`)
    );
  })
  .catch(err => {
    console.error("Err", err);
    process.exit(0);
  });

module.exports = app;
