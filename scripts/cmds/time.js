const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "Time Bot",
    version: "1.0",
    author: "Your Name",
  },

  onStart: async function ({ api }) {
    console.log("Time Bot started!");
  },

  onStart: async function ({ api, event }) {
    const { body, threadId, messageID } = event;
    if (body.toLowercase() === "time") {const currentTime = moment.tz("Asia/Karachi").format("HH:mm:ss");
    api.sendMessage(`Current time in Pakistan: ${currentTime}`, event.threadID, event.messageID);
                                         }
  },
};