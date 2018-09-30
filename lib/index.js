const express = require("express");
const app = express();
const join = require("path").join;
const bodyParser = require("body-parser");
const passport = require("passport");
const fileUpLoad = require("express-fileupload");

const auth = require("./middlewares/authenticate");

const db = require("../configs/db");
const configApp = require("../configs/indexApp");
const sequelize = require("../configs/db");

const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const meRouter = require("./routes/me");
const userRouter = require("./routes/user");
const itemRouter = require("./routes/item");

sequelize
  .authenticate()
  .then(() => {
    app.use(bodyParser.json());
    app.use(fileUpLoad());
    app.use(passport.initialize());
    db.sync();

    app.use("/images", express.static(join(__dirname, "/itemImage")));

    app.use("/api/register", registerRouter);
    app.use("/api/login", loginRouter);
    app.use("/api/me", auth().authenticate(), meRouter);
    app.use("/api/user", userRouter);
    app.use("/api/item", itemRouter);

    app.listen(configApp.port, () =>
      console.log(`Listen on port: ${configApp.port}`)
    );
  })
  .catch(err => {
    console.error("Err", err);
    process.exit(0);
  });

module.exports = app;
