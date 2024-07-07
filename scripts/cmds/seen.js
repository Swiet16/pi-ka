module.exports = {
  config: {
    name: "autoseen",
    version: "1.0",
    author: "Your Name",
    hasPermssion: 2,
    description: "Automatically marks all messages as read",
    commandCategory: "admin",
    usages: "[no additional arguments]",
    cooldowns: 5,
  },

  onStart: async function ({ api }) {
    console.log("AutoSeen Bot started!");
  },

  handleEvent: async function ({ api, event }) {
    try {
      await api.markAsReadAll();
    } catch (e) {
      console.log(e);
    }
  },

  run: async function ({ api, event }) {
    api.sendMessage("AutoSeen is active. All messages will be marked as read.", event.threadID, event.messageID);
  }
};