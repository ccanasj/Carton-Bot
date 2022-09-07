const { MessageEmbed } = require("discord.js");
const {saveMods} = require("../../utils/mongo");

module.exports = class Start {
    constructor() { }

    async run(name, interaction, client) {
        const result = await saveMods(interaction.guildId);
        interaction.reply({ content: name + " se inicio? xd\n"});
    }
};
