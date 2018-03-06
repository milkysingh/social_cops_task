const authenticate = require("../middlewares/authenticate");
const utils = require("../utils/util");
const fs = require("fs");
const jsonpatch = require("jsonpatch");
const winston = require("winston");

module.exports = (app) => {
  app.get("/downloadThumbnail/*", async (req, res) => {
    const imageUri = req.params["0"];
    try {
      const thumbnail = await utils.createThumbnail(imageUri);
      fs.readFile(thumbnail, (err, content) => {
        if (err) {
          winston.log("error", err);
        }
        if (!err) {
          res.status(200).send(content);
        }
      });
    } catch (error) {
      winston.log("error", error);
      res.status(400).send(error);
    }
  });

  app.get("/patchJson", authenticate, (req, res) => {
    const mydoc = JSON.parse(req.query.json);
    const thepatch = JSON.parse(req.query.patchObj);

    const result = jsonpatch.apply_patch(mydoc, thepatch);
    res.status(200).send(result);
  });
};
