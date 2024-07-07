const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const { getStreamFromURL, shortenURL, randomString } = global.utils;

module.exports = {
	threadStates: {},
	config: {
		name: 'autolink',
		version: '1.0',
		author: 'Kshitiz',
		countDown: 5,
		role: 0,
		shortDescription: 'downloader',
		longDescription: '',
		category: 'media',
		guide: {
			en: '{p}{n}',
		}
	},
	onStart: async function ({ api, event }) {
		const threadID = event.threadID;

		if (!this.threadStates[threadID]) {
			this.threadStates[threadID] = {};
		}

		if (event.body.toLowerCase().includes('autolink')) {
			api.sendMessage("AutoLink is active.", event.threadID, event.messageID);
		}
	},
	onChat: async function ({ api, event }) {
		if (this.checkLink(event.body)) {
			const { url } = this.checkLink(event.body);
			console.log(`Attempting to download from URL: ${url}`);
			this.downLoad(url, api, event);
			api.setMessageReaction("💐", event.messageID, (err) => {}, true);
		}
	},
	downLoad: function (url, api, event) {
		const time = Date.now();
		const path = __dirname + `/cache/${time}.mp4`;

		if (url.includes("instagram")) {
			this.downloadInstagram(url, api, event, path);
		} else if (url.includes("facebook") || url.includes("fb.watch")) {
			this.downloadFacebook(url, api, event, path);
		} else if (url.includes("tiktok")) {
			this.downloadTikTok(url, api, event, path);
		}
	},
	downloadInstagram: async function (url, api, event, path) {
		try {
			const res = await this.getLink(url, api, event, path);
			const response = await axios({
				method: "GET",
				url: res,
				responseType: "arraybuffer"
			});
			fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
			if (fs.statSync(path).size / 1024 / 1024 > 25) {
				return api.sendMessage("The file is too large, cannot be sent", event.threadID, () => fs.unlinkSync(path), event.messageID);
			}

			const shortUrl = await shortenURL(res);
			const messageBody = `✅ 🔗 Download Url: ${shortUrl}`;

			api.sendMessage({
				body: messageBody,
				attachment: fs.createReadStream(path)
			}, event.threadID, () => fs.unlinkSync(path), event.messageID);
		} catch (err) {
			console.error(err);
		}
	},
	downloadFacebook: async function (url, api, event, path) {
		try {
			const res = await fbDownloader(url);
			if (res.success && res.download && res.download.length > 0) {
				const videoUrl = res.download[0].url;
				const response = await axios({
					method: "GET",
					url: videoUrl,
					responseType: "stream"
				});
				if (response.headers['content-length'] > 87031808) {
					return api.sendMessage("The file is too large, cannot be sent", event.threadID, () => fs.unlinkSync(path), event.messageID);
				}
				response.data.pipe(fs.createWriteStream(path));
				response.data.on('end', async () => {
					const shortUrl = await shortenURL(videoUrl);
					const messageBody = `✅🔗 Download Url: ${shortUrl}`;

					api.sendMessage({
						body: messageBody,
						attachment: fs.createReadStream(path)
					}, event.threadID, () => fs.unlinkSync(path), event.messageID);
				});
			} else {
				api.sendMessage("", event.threadID, event.messageID);
			}
		} catch (err) {
			console.error(err);
		}
	},
	downloadTikTok: async function (url, api, event, path) {
		try {
			const res = await this.getLink(url, api, event, path);
			const response = await axios({
				method: "GET",
				url: res,
				responseType: "arraybuffer"
			});
			fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
			if (fs.statSync(path).size / 1024 / 1024 > 25) {
				return api.sendMessage("The file is too large, cannot be sent", event.threadID, () => fs.unlinkSync(path), event.messageID);
			}

			const shortUrl = await shortenURL(res);
			const messageBody = `✅  Download Url: ${shortUrl}`;

			api.sendMessage({
				body: messageBody,
				attachment: fs.createReadStream(path)
			}, event.threadID, () => fs.unlinkSync(path), event.messageID);
		} catch (err) {
			console.error(err);
		}
	},
	getLink: function (url, api, event, path) {
		return new Promise((resolve, reject) => {
			if (url.includes("instagram")) {
				axios({
					method: "GET",
					url: `https://public-apis-project86.vercel.app/api/insta?url=${encodeURIComponent(url)}`
				})
				.then(res => {
					console.log(`API Response: ${JSON.stringify(res.data)}`);
					if (res.data.url) {
						resolve(res.data.url);
					} else {
						reject(new Error("Invalid response from the API"));
					}
				})
				.catch(err => reject(err));
			} else if (url.includes("facebook") || url.includes("fb.watch")) {
				fbDownloader(url).then(res => {
					if (res.success && res.download && res.download.length > 0) {
						const videoUrl = res.download[0].url;
						resolve(videoUrl);
					} else {
						reject(new Error("Invalid response from the Facebook downloader"));
					}
				}).catch(err => reject(err));
			} else if (url.includes("tiktok")) {
				this.queryTik