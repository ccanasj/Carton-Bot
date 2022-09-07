const BaseCommand = require('../../utils/structures/BaseCommand');
const {getMods} = require("../../utils/mongo");
const { MessageEmbed , MessageAttachment } = require("discord.js");
var fs = require('fs');

module.exports = class GetMods extends BaseCommand {
  constructor() {
    super('mods', 'mods', []);
  }

  async run(client, message, args) {

    const mods = await getMods(message.guildId);
    let data = JSON.stringify(mods.mods);
    fs.writeFile('mods.json', data, function (err) {
      if (err) throw err;
      console.log('File is created successfully.');
    });
    message.channel.send({
      files: [{
        attachment: 'mods.json',
        name: 'mods.json'
      }]
    }); 
    let str = "";
    let cont = 1;
    //for (let mod in mods.mods) {
    //    str += `**${cont++}** [${mods.mods[mod].split('/').pop()}](${mods.mods[mod]})\n`
    //}
    //const embed = new MessageEmbed()
    //.setColor("AQUA")
    //.setTitle(`Mods totales`)
    //.setDescription('str');
    
    //message.reply({embeds: [embed]});
  }
}