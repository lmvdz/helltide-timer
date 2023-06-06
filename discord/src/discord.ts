import { config } from 'dotenv';
import { Channel, Client, GatewayIntentBits, Message, TextChannel, EmbedBuilder, APIEmbedField } from 'discord.js';

config()

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });

discordClient.on('ready', () => {
    console.log("discord bot loaded");
})

export async function discordLogin(discordClient: Client) {
    await discordClient.login(process.env.DISCORD_BOT_TOKEN);
}

export default discordClient