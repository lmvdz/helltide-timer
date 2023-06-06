import { APIEmbedField, EmbedBuilder, TextChannel } from "discord.js";
import discordClient, { discordLogin } from "./discord";
import express from 'express'

const app = express();
app.get('/thumbnail', (req, res) => res.sendFile('../DiabloIV.png'))
app.listen(5124, () => {console.log("helltide timer server started on 5124")})

function hrTohhmmss(decimalTimeString){
    let decimalTime = parseFloat(decimalTimeString);
    decimalTime = decimalTime * 60 * 60;
    let hours: any = Math.floor((decimalTime / (60 * 60)));
    decimalTime = decimalTime - (hours * 60 * 60);
    let minutes: any = Math.floor((decimalTime / 60));
    decimalTime = decimalTime - (minutes * 60);
    let seconds: any = Math.round(decimalTime);
    if(hours < 10)
    {
        hours = "0" + hours;
    }
    if(minutes < 10)
    {
        minutes = "0" + minutes;
    }
    if(seconds < 10)
    {
        seconds = "0" + seconds;
    }
    return "" + hours + ":" + minutes + ":" + seconds
}

const recordedHelltideStart = 1686056400000;
const helltideTime = 60 * 60 * 1000; // 1hr
const helltideCooldown = 75 * 60 * 1000; // 1hr 15min


const buildDiscordMessageEmbed = () => {

}

(async () => {
    await discordLogin(discordClient)
    await discordClient.channels.fetch(process.env.DISCORD_CHANNEL)
    let textChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL) as TextChannel

    setInterval(() => {
        var now = new Date()
        var since = (now as any) - recordedHelltideStart;
        var timeleft = 0;
        var onCooldown = false
    
        while (since > 0) {
            since -= (helltideTime)
            onCooldown = false;
            if (since > 0) {
                since -= helltideCooldown
                onCooldown = true;
            }
        }
        timeleft = Math.abs(since)
        let timeleftInHrs = hrTohhmmss(timeleft / 1000 / 60 / 60)
        
        let embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Helltide Timer')
            .setURL('https://helltidetimer.com/')
            .setAuthor({
                name: onCooldown ? 'Over' : 'Active',
                // iconURL: 'https://i.imgur.com/AfFp7pu.png', 
                // url: 'https://discord.js.org'
            })
            .setDescription(new Date().toUTCString())
            .setThumbnail('https://helltidetimer.com/thumbnail')
            .setTimestamp()
            // .setFooter({ text: twitchUserInfo.display_name, iconURL: twitchUserInfo.profile_image_url })
            .setFooter({ text: 'HelltideTimerBot' })
        let fields = [{ name: timeleftInHrs, value: '\u200B' }] as Array<APIEmbedField>;
        embed.addFields({ name: '\u200B', value: '\u200B' }, ...fields)
        // const end = new Date(now.getTime() +  timeleft);
        // document.getElementById('timer').innerHTML = `
        //     <h1 id="header">Helltide Timer</h1>
        //     <p id="status">Helltide is ${onCooldown ? '<strong>over</strong>' : '<strong>active</strong>'}</p>
        //     <p id="counter"><span id="counterTime">${}</span></p>
        // `
        textChannel.send({ embeds: [embed] })
    }, 1000)
    
})()
