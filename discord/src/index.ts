import { config } from 'dotenv'
import { APIEmbedField, Channel, EmbedBuilder, Message, TextChannel } from "discord.js";
import discordClient, { discordLogin } from "./discord";
import express from 'express'
import updateEnv from './updateEnv'
config()
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

function getMessageToEdit(discordClient): Promise<Message<boolean>> {
    return new Promise((resolve, reject) => {
        discordClient.channels.fetch(process.env.DISCORD_CHANNEL).then((channel: Channel | null) => {
            if (channel === null) {
                console.error('no channel found with id: ' + process.env.DISCORD_CHANNEL);
                reject('no channel found with id: ' + process.env.DISCORD_CHANNEL);
                return;  
            }
            (channel as TextChannel).messages.fetch().then((messages) => {
                resolve(messages.get(process.env.DISCORD_CHANNEL_MESSAGE))
            }).catch(error => {
                console.error(error);
                reject(error);
            })
        })
    })
}

(async () => {
    config()
    await discordLogin(discordClient)
    await discordClient.channels.fetch(process.env.DISCORD_CHANNEL)
    let message;
    if (process.env.DISCORD_CHANNEL_MESSAGE) {
        message = await getMessageToEdit(discordClient)
    }
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
            .setTitle('Helltide Timer Website')
            .setURL('https://helltidetimer.com/')
            .setAuthor({
                name: onCooldown ? 'Helltide is Over' : 'Helltide is Active',
            })
            .setThumbnail('https://helltidetimer.com/DiabloIV.png')
            .setFooter({ text: 'HelltideTimerBot' })
        let fields = [{ name: (onCooldown ? 'Active in ' : 'Over in ') + timeleftInHrs, value: '\u200B' }] as Array<APIEmbedField>;
        embed.addFields(...fields)
        const messageToSend = { embeds: [embed] }
        if (message === undefined) {
            textChannel.send(messageToSend).then((message) => {
                updateEnv("DISCORD_CHANNEL_MESSAGE", message.id)
                console.log('message send and updated env ' + new Date().toUTCString())
            })
        } else {
            message.edit(messageToSend).then(() => {
                console.log('message updated ' + new Date().toUTCString())
            })
        }
    }, 10000)
})()
