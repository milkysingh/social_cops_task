const sharp = require("sharp");
const http = require("http");
const https = require("https");
const fs = require("fs");

const resizeImage = new sharp().resize(50, 50).max();

const createThumbnail = async imgURL => {
  return new Promise((resolve, reject) => {
    try {
      let httpLib = http;
      if (/^https/.test(imgURL)) {
        httpLib = https;
      }
      httpLib.get(imgURL, downloadStream => {
        const outputPath = `./output ${new Date()}  .png`;
        const writable = fs.createWriteStream(outputPath);
        downloadStream.pipe(resizeImage).pipe(writable);

        downloadStream.on("end", () => {
          console.log("completed");
        });
        writable.on("finish", err => {
          resolve(outputPath);
        });
        writable.on("error", err => {
          reject;
        });
        downloadStream.on("error", err => {
          reject;
        });
      });
    } catch (error) {
      console.log("Error>>>>>   ", error);
    }
  });
};

module.exports = {
  createThumbnail
};
