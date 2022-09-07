const BaseEvent = require("../utils/structures/BaseEvent");
const schMod = require("../interactions/mods/buscarCmd");
const download = require("../interactions/mods/urlsMod");
const start = require("../interactions/mods/iniciar");

module.exports = class InteractionCreateEvent extends BaseEvent {
  constructor() {
    super("interactionCreate");
  }

  async run(client, interaction) {
    const { commandName, options } = interaction;
    
    switch (commandName) {
      case "mod":
        const cmd = new schMod();
        if (options._hoistedOptions.length != 0) {
          const nombreMod = options._hoistedOptions.find((item) => {
            return item.name == "nombre_mod";
          });
          const versionMod = options._hoistedOptions.find((item) => {
            return item.name == "version";
          });

          if (nombreMod && versionMod) {
            if (
              /[1]{1,2}\.\d{1,2}\.\d{1,2}/.test(
                options._hoistedOptions[1].value
              )
            ) {
              cmd.run(
                options._hoistedOptions[0].value,
                options._hoistedOptions[1].value,
                interaction,
                client
              );
            } else {
              interaction.reply({ content: "Pa eso no cuenta como version" });
            }
          } else if (nombreMod) {
            cmd.run(options._hoistedOptions[0].value, "", interaction, client);
          } else {
            cmd.run("", "", interaction, client);
          }
        } else {
          cmd.run("", "", interaction, client);
        }
        break;
      case "descargar":
        const dwm = new download();
          dwm.run(
            options._hoistedOptions[0].value,
            options._hoistedOptions[1].value,
            interaction,
            client
          );
        break;
      case "iniciar":
          const iniciar = new start();
          iniciar.run(
              options._hoistedOptions[0].value,
              interaction,
              client
            );
          break;
    }
  }
};
