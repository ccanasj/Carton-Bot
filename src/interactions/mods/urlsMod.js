const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { MessageEmbed } = require("discord.js");
const {insertMods} = require("../../utils/mongo");

const headers = {
  Accept: "application/json",
  "x-api-key": process.env.APIKEY,
};

const getURL = async function (id, version, links = {}) {
  return fetch(`https://api.curseforge.com/v1/mods/${id}/files?gameVersion=${version}&modLoaderType=1&pageSize=1`,
    {
      method: "GET",
      headers: headers,
    }
  ).then(function (res) {
    return res.json();
  }).then(async function (body) {
    if(body.data.length === 0){
      return '404'
    }
    let dep = body.data[0].dependencies.filter((depRes) => depRes.relationType === 3);
    if(body.data[0].downloadUrl){
      links[body.data[0].modId] = body.data[0].downloadUrl;
    } else {
      let fileVer = [String(body.data[0].fileId).slice(0, 4), String(body.data[0].fileId).slice(4)];
      links[body.data[0].modId] = `https://media.forgecdn.net/files/${fileVer[0]}/${fileVer[1]}/${body.data[0].filename}`;
    }
    
    for (let i of dep) {
      if (!(i.modId in links)) {
        await getURL(i.modId, version, links);
      }
    }
    return links;
  })
};

module.exports = class File {
  constructor() { }

  run(id, ver, interaction, client) {
    getURL(id, ver).then(async res => {
      if(res === '404'){
        interaction.reply({content: 'Emanuel chupelo' })
        return 0
      }
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`Melo`)

      /*for (let mod in res) {
        embed.addField(`ID mod ${mod}`, `[${res[mod].split('/').pop()}](${res[mod]})`)
      }*/

      const result = await insertMods(interaction.guildId,res);
      interaction.reply({content: result, embeds: [embed] });

    })
  }
};
