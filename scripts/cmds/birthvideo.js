module.exports = {
  config: {
    name: "birthvideo",
    aliases: ["birthdayvideo"],
    version: "1.0",
    author: "satish",
    countDown: 20,
    role: 0,
    shortDescription: "get birthday video",
    longDescription: "it will send you birthday video.",
    category: "𝗪𝗜𝗦𝗛𝗘𝗦𝗛",
    guide: "{pn} birthdayvideo",
  },

  sentVideos: [],

  onStart: async function ({ api, event, message }) {
    const senderID = event.senderID;

    const loadingMessage = await message.reply({
      body: "Loading random birthday video... Please wait! 🕐",
    });

    const link = [
      "https://i.imgur.com/8ihNouL.mp4",
      "https://i.imgur.com/8LbRyxu.mp4",
      "https://i.imgur.com/PPNGvOw.mp4",
      "https://i.imgur.com/oJivRaw.mp4",
      "https://i.imgur.com/pQkv8JQ.mp4",
      "https://i.imgur.com/CdToiO6.mp4",
      "https://i.imgur.com/LkJRR3l.mp4",
      "https://i.imgur.com/RKGsqtV.mp4",
      "https://i.imgur.com/6jfeuEm.mp4",
      "https://i.imgur.com/FcLgqK2.mp4",
      "https://i.imgur.com/WKtar8b.mp4",
      "https://i.imgur.com/xnEmsgK.mp4",
      "https://i.imgur.com/cfYo6l3.mp4",
      "https://i.imgur.com/9NoQ42e.mp4",
      "https://i.imgur.com/fbI966E.mp4",
      "https://i.imgur.com/09IqXdi.mp4",
      "https://i.imgur.com/z01Hat6.mp4",
      "https://i.imgur.com/t3UAKdX.mp4",
      "https://i.imgur.com/782vLa4.mp4",
      "https://i.imgur.com/bHH6rbo.mp4",
      "https://i.imgur.com/jBLpS1L.mp4",
      "https://i.imgur.com/3WscDpB.mp4",
      "https://i.imgur.com/wRNAUzy.mp4",
      "https://i.imgur.com/2gErwUH.mp4",
      "https://i.imgur.com/YFF3mWg.mp4",
      "https://i.imgur.com/GUGTczR.mp4",
      "https://i.imgur.com/oocdxwo.mp4",
      "https://i.imgur.com/WHtluZy.mp4",
      "https://i.imgur.com/bGE8Epg.mp4",
      "https://i.imgur.com/ivH7oua.mp4",
    ];

    const availableVideos = link.filter(video => !this.sentVideos.includes(video));

    if (availableVideos.length === 0) {
      this.sentVideos = [];
    }

    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    const randomVideo = availableVideos[randomIndex];

    this.sentVideos.push(randomVideo);

    if (senderID !== null) {
      message.reply({
        body: '',
        attachment: await global.utils.getStreamFromURL(randomVideo),
      });

      setTimeout(() => {
        api.unsendMessage(loadingMessage.messageID);
      }, 5000);
    }
  },
};