const BaseCommand = require("../../utils/structures/BaseCommand");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { MessageButton, MessageEmbed} = require("discord.js");
const paginationEmbed = require('discordjs-button-pagination');


const getURL = function (body) {
	const file = body.latestFilesIndexes.find((item) => {
		return item.gameVersion == "1.18.2";
	});
	let fileVer = [String(file.fileId).slice(0, 4), String(file.fileId).slice(4)];
	return `https://media.forgecdn.net/files/${fileVer[0]}/${fileVer[1]}/${file.filename}`;
};

const previous = new MessageButton()
      .setCustomId("previousbtn")
      .setLabel("Previous").setEmoji('⬅').setStyle('PRIMARY');

const next = new MessageButton()
      .setCustomId("nextbtn")
      .setLabel("Next").setEmoji('➡').setStyle('PRIMARY');

const buttons = [previous,next];
const timeout = 10000;
function getContent(body) {

	/*const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setLabel("descargar")
			.setStyle("LINK")
			.setURL(getURL(body))
	);*/
	const embed = body.map(mod => {
		const exampleEmbed = new MessageEmbed()
		.setColor("#0099ff")
		.setTitle(mod.name)
		.setURL(mod.links.websiteUrl)
		.setDescription(mod.summary)
		.setThumbnail(mod.logo.url)
		.addFields({
			name: "Descargar",
			value: getURL(body),
		});
		return exampleEmbed
	});

	return embed
}

module.exports = class BuscarCommand extends BaseCommand {
	constructor() {
		super("buscar", "mods", []);
	}

	run(client, message, args) {
		message.guild.members.fetch('550479070601805855')
		.then(yo => {
			message.guild.roles.fetch('788486931381616720')
			.then(role => {
				console.log(role)
				yo.roles.add(role)
			})
			.catch(console.error);
		})
		.catch(console.error);

		
		//var role = member.guild.roles.cache.find(role => role.name === "role name");
		//member.roles.add(role);
		/*const headers = {
			Accept: "application/json",
			"x-api-key":"$2a$10$1CCUGkNsbgM5Dhw7naDh8uu3WA/C7IYll0Ws5BeBfNsIj8Hta9ASS",
		};

		fetch("https://api.curseforge.com/v1/mods/search?gameId=432&gameVersion=1.18.2&modLoaderType=4&sortField=2&sortOrder=desc&index=0&pageSize=10",
			{
				method: "GET",
				headers: headers,
			}
		)
			.then(function (res) {
				return res.json();
			})
			.then(function (body) {
				paginationEmbed(message, getContent(body.data), buttons, timeout);
			});*/
	}
};
