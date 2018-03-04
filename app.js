const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("./config/config");
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");

mongoose.connect(config.mongoURL);

app.use(bodyParser.json());
require("./model/User");

require("./routes/auth")(app);
require("./routes/anotherRoutes")(app);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
module.exports = { app };
