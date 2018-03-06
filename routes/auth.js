const UserServices = require("../services/userService");
const MongoServices = require("../services/mongoService");
const constants = require("../constants");

const ERROR_MESSAGES = constants.errorResponse;
const authenticate = require("../middlewares/authenticate");

module.exports = (app) => {
  // eslint-disable-next-line
  app.post("/signup", async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).send({ error: "Missing Credentials" });
    }
    if (userName === "" || (password && password === "")) {
      return res.status(400).send({ error: "Missing Credentials" });
    }
    const encryptPassword = await UserServices.hashPasswordUsingBcrypt(password);

    const data = {
      userName,
      password: encryptPassword,
    };
    let user;
    try {
      user = await MongoServices.createNewUser(data);
      const criteriaForJWT = {
        // eslint-disable-next-line
        id: user._id,
        date: new Date(),
      };
      const token = await UserServices.generateAuthToken(criteriaForJWT);
      if (token) {
        res
          .header("x-auth", token)
          .status(200)
          .send(user);
      }
    } catch (error) {
      return res.status(409).send({ error });
    }
  });

  app.post("/login", async (req, res) => {
    const { userName, password } = req.body;

    const user = await UserServices.findUser(userName, password);

    if (user) {
      const criteriaForJWT = {
        // eslint-disable-next-line
        id: user._id,
        date: new Date(),
      };
      const token = await UserServices.generateAuthToken(criteriaForJWT);

      return res
        .header("x-auth", token)
        .status(200)
        .send(user);
    }
    return res.status(401).send(ERROR_MESSAGES.UNAUTHORISED);
  });

  app.get("/ifLogin", authenticate, (req, res) => {
    res.send(req.user);
  });
};
