module.exports = {
	config: {
		name: "print",
		aliases: ["rp"],
		author: 'Aziz',
		countDown: 5,
		role: 0,
		category: "fun",
		shortDescription: {
			en: 'Reply to a picture',
		},
	},
	onStart: async function ({ api, event, args, usersData }) {
		const { loadImage, createCanvas, registerFont } = require("canvas");
		const fs = require("fs-extra");
		const axios = require("axios");

		let { senderID, threadID, messageID, messageReply, body } = event;
		let pathImg = __dirname + `/cache/${senderID}.png`;

		if (!messageReply ||!messageReply.attachments || messageReply.attachments.length === 0) {
			return api.sendMessage('Please reply to a picture', threadID, messageID);
		}

		let attachment = messageReply.attachments[0];
		if (attachment.type!== 'photo') {
			return api.sendMessage('Please reply to a picture', threadID, messageID);
		}

		// Download the image buffer using axios
		let imgBuffer = (await axios.get(attachment.url, { responseType: 'arraybuffer' })).data;
		fs.writeFileSync(pathImg, imgBuffer);

		// Load the base image
		let baseImage = await loadImage(pathImg);
		let canvas = createCanvas(baseImage.width, baseImage.height);
		let ctx = canvas.getContext("2d");

		// Draw the base image on the canvas
		ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

		// Register a stylish font
		registerFont(__dirname + '/fonts/Rockybilly.ttf', { family: 'Rockybilly' });

		// Set font properties
		ctx.font = 'bold 80px Rockybilly';
		ctx.fillStyle = "#ffc0cb";
		ctx.strokeStyle = "#00000"; // border color
		ctx.lineWidth = 4; // border width
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";
		

		// Extract the text after the command name and prefix
		const commandName = this.config.name;
		const prefix = "."; // or whatever prefix you're using
		const text = body.replace(new RegExp(`^${prefix}${commandName}\\s*`), "").trim();


		const textWidth = ctx.measureText(text).width;
		const textHeight = 10; // assume a fixed height for the text
		
		// Draw the text on the image
		ctx.fillText(text, 160, canvas.height - textHeight + 3);
		ctx.strokeText(text, 160, canvas.height - textHeight + 3);

		// Convert canvas to buffer and save it
		const imageBuffer = canvas.toBuffer();
		fs.writeFileSync(pathImg, imageBuffer);

		// Send the modified image back to the sender
		return api.sendMessage(
			{ attachment: fs.createReadStream(pathImg) },
			threadID,
			() => fs.unlinkSync(pathImg),
			messageID
		);
	},
};