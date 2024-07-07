const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ PIKA]"; // changing this wont change the goatbot V2 of list cmd it is just a decoyy

module.exports = {
	config: {
		name: "help",
		version: "1.17",
		author: "AZIZ", // original author Kshitiz 
		countDown: 5,
		role: 0,
		shortDescription: {
			en: "View command usage and list all commands directly",
		},
		longDescription: {
			en: "View command usage and list all commands directly",
		},
		category: "info",
		guide: {
			en: "{pn} / help cmdName ",
		},
		priority: 1,
	},

	onStart: async function ({ message, args, event, threadsData, role }) {
		const { threadID } = event;
		const threadData = await threadsData.get(threadID);
		const prefix = getPrefix(threadID);

		if (args.length === 0) {
			const categories = {};
			let msg = "";

			msg += `【𝗦𝗛𝗜𝗡 𝗙𝗢𝗥𝗚𝗘𝗥】`; // replace with your name 

			for (const [name, value] of commands) {
				if (value.config.role > 1 && role < value.config.role) continue;

				const category = value.config.category || "Uncategorized";
				categories[category] = categories[category] || { commands: [] };
				categories[category].commands.push(name);
			}

			Object.keys(categories).forEach((category) => {
				if (category !== "info") {
					msg += `\n ┏━━━┓\n ┣━━[${category.toUpperCase()}]`;


					const names = categories[category].commands.sort();
					for (let i = 0; i < names.length; i += 1) {
						const cmds = names.slice(i, i + 1).map((item) => `┣${item}`);
						msg += `\n ${cmds.join(" ".repeat(Math.max(1, 10 - cmds.join("").length)))}`;
					}

					msg += `\n ┗━━━━━━━━━━֎`;
				}
			});

			const totalCommands = commands.size;
			msg += `\nTotal commands: ${totalCommands}\n\n`;
			msg += `Type ${prefix} help ‹cmdname› to view the details.\n\n`;
			msg += `━━━━ OWNER ━━━━\nWINNER💗\n━━━━ ◦ ❖ ◦ ━━━━`; // its not decoy so change it if you want 

			const helpListImages = [
				"https://i.ibb.co/PYqZKgv/image.jpg",
				
			// add image link here

				// Add more image links as needed
			];

			const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

			await message.reply({
				body: msg,
				attachment: await global.utils.getStreamFromURL(helpListImage),
			});
		} else {
			const commandName = args[0].toLowerCase();
			const command = commands.get(commandName) || commands.get(aliases.get(commandName));

			if (!command) {
				await message.reply(`Command "${commandName}" not found.`);
			} else {
				const configCommand = command.config;
				const roleText = roleTextToString(configCommand.role);
				const author = configCommand.author || "Unknown";

				const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";

				const guideBody = configCommand.guide?.en || "No guide available.";
				const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

				const response = `
	 ┏━𝗡𝗔𝗠𝗘 ━━━━━━⦿\n┣${configCommand.name}\n┣━ 𝗜𝗡𝗙𝗢\n┃\n┣━DESCRIPTION\n┃${longDescription}\n┣━━VERSION \n┃${configCommand.version || "1.0"}
┣━━ROLE
┃${roleText}
┣━━TIME
┃${configCommand.countDown || 1}s
┣━━USAGE
┃${usage}\n┗©PIKA-CHU`;

				await message.reply(response);
			}
		}
	},
};

function roleTextToString(roleText) {
	switch (roleText) {
		case 0:
			return "0 (All users)";
		case 1:
			return "1 (Group administrators)";
		case 2:
			return "2 (Admin bot)";
		default:
			return "Unknown role";
	}
}