import { config } from 'dotenv';
import { Client, GatewayIntentBits} from 'discord.js';

config()

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });

discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}`);
})

export async function discordLogin(discordClient: Client) {
    await discordClient.login(process.env.DISCORD_BOT_TOKEN);
}

export default discordClient