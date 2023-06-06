"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordLogin = void 0;
const dotenv_1 = require("dotenv");
const discord_js_1 = require("discord.js");
(0, dotenv_1.config)();
const discordClient = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}`);
});
async function discordLogin(discordClient) {
    await discordClient.login(process.env.DISCORD_BOT_TOKEN);
}
exports.discordLogin = discordLogin;
exports.default = discordClient;
//# sourceMappingURL=discord.js.map