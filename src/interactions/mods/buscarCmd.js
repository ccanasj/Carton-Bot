const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const paginationEmbed = require("discordjs-button-pagination");

const headers = {
  Accept: "application/json",
  "x-api-key": process.env.APIKEY,
};
const getDep = function (id, version) {
  return fetch(
    `https://api.curseforge.com/v1/mods/${id}/files?gameVersion=${version}`,
    {
      method: "GET",
      headers: headers,
    }
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (body) {
      return body.data[0].downloadUrl;
    })
    .catch((err) => {
      return err;
    });
  /*
      fetch(
          `https://api.curseforge.com/v1/mods/${id}/files?gameVersion=${version}`,
          {
          method: "GET",
          headers: headers,
          }
      )
      .then(function (res) {
        return res.json();
      })
      .then(function (body) {
        console.log(body.data[0].downloadUrl);
        return body.data[0].downloadUrl;
      });*/
};

const getURL = async function (id, version) {
  return fetch(
    `https://api.curseforge.com/v1/mods/${id}/files?gameVersion=${version}`,
    {
      method: "GET",
      headers: headers,
    }
  )
    .then(function (res) {
      return res.json();
    })
    .then(async function (body) {
      let dep = body.data[0].dependencies.filter(
        (depRes) => depRes.relationType === 3
      );
      let results = [body.data[0].downloadUrl];
      for (let i of dep) {
        results.push(await getDep(i.modId, version));
      }
      return results;
    });
};

const previous = new MessageButton()
  .setCustomId("previousbtn")
  .setLabel("Previous")
  .setEmoji("⬅")
  .setStyle("PRIMARY");

const next = new MessageButton()
  .setCustomId("nextbtn")
  .setLabel("Next")
  .setEmoji("➡")
  .setStyle("PRIMARY");

const buttons = [previous, next];
const timeout = 10000;

async function getContent(body, version) {
  let embed = [];
  for (let mod of body) {
    let links = await getURL(mod.id, version);
    embed.push(
      new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(mod.name)
        .setURL(mod.links.websiteUrl)
        .setDescription(mod.summary)
        .setThumbnail(mod.logo.url)
        .addFields(
          {
            name: "Id",
            value: String(mod.id),
          },
          {
            name: "Descargar",
            value: links.every((valor) => valor)
              ? links.join("\n")
              : "Sin links",
          }
        )
    );
  }
  return embed;
}

module.exports = class Buscar {
  constructor() { }

  run(name, ver, interaction, client) {
    fetch(
      `https://api.curseforge.com/v1/mods/search?gameId=432&gameVersion=${ver}&sortField=2&sortOrder=desc&pageSize=10&searchFilter=${name}`,
      {
        method: "GET",
        headers: headers,
      }
    )
      .then(function (res) {
        return res.json();
      })
      .then(async function (body) {
        //interaction.reply({ content: "No se pai" });
        if (body.data.length) {
          paginationEmbed(
            interaction,
            await getContent(body.data, ver),
            buttons,
            timeout
          );
        } else {
          interaction.reply({ content: "No se pai" });
        }
      });
  }
};
