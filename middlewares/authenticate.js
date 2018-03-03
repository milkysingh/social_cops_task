const UserServices = require("../services/userService");
const ERROR_MESSAGES = require("../constants").errorResponse;
const authenticate = async (req, res, next) => {
  const token = req.header("x-auth");

  if (token) {
    try {
      const user = await UserServices.findByToken(token);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      console.log(token);
      return res.status(401).send({ err: ERROR_MESSAGES.UNAUTHORISED });
    }
  }
  return res.status(401).send({ err: ERROR_MESSAGES.UNAUTHORISED });
};

module.exports = authenticate;
