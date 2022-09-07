const BaseEvent = require("../../utils/structures/BaseEvent");
const { token } = require("../../../slappey.json");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }

  async run(client) {
    console.log(client.user.tag + " has logged in.");
    client.user.setActivity("Minecraft Mode");

    const rest = new REST({ version: "9" }).setToken(token);
    const CLIENT_ID = client.user.id;

    (async () => {
      try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands(CLIENT_ID), {
          body: await this.createcmd(),
        });

        console.log("Successfully reloaded application (/) commands.");
      } catch (error) {
        console.error(error);
      }
    })();
  }

  createcmd() {
    const commands = [
      new SlashCommandBuilder()
        .setName("mod")
        .setDescription("Buscar mod")
        .addStringOption((option) =>
          option
            .setName("nombre_mod")
            .setDescription("Nombre del mod")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("version")
            .setDescription("Version de minecraft")
            .setRequired(false)
        ),
        new SlashCommandBuilder()
        .setName("descargar")
        .setDescription("descargar mods")
        .addStringOption((option) =>
          option
            .setName("mod")
            .setDescription("ID del mod")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("version")
            .setDescription("Version de minecraft")
            .setRequired(true)
        ),
        new SlashCommandBuilder()
        .setName("iniciar")
        .setDescription("si")
        .addStringOption((option) =>
          option
            .setName("nombre")
            .setDescription("nombre")
            .setRequired(true)
        ),
    ].map((command) => command.toJSON());

    return commands;
  }
};
