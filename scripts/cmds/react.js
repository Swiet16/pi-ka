module.exports = {
  config: {
    name: "autoreact2",
    version: "1.0",
    author: "Loid/Zed",
    countDown: 5,
    role: 0,
    shortDescription: "",
    longDescription: "",
    category: "auto",
  },
  onStart: async function () {},
  onChat: async function ({ event, api }) {
    const reactions = {
      "yo": "🤍",
      "stalker": "🤬",
      "pakyu": "🤬",
      "suntukan": "😾",
      "tang ina": "🤬",
      "thankyou": "🤍",
      "welcome": "🤍",
      "sad": "😔",
      "useless": "🥹",
      "lungkot": "😓"
    };

    for (const [keyword, reaction] of Object.entries(reactions)) {
      if (event.body.toLowerCase().includes(keyword)) {
        return api.setMessageReaction(reaction, event.messageID, (err) => {
          if (err) console.error(err);
        });
      }
    }
  },
};
