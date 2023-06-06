"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const discord_js_1 = require("discord.js");
const discord_1 = __importStar(require("./discord"));
const express_1 = __importDefault(require("express"));
const updateEnv_1 = __importDefault(require("./updateEnv"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.get('/thumbnail', (req, res) => res.sendFile('../DiabloIV.png'));
app.listen(5124, () => { console.log("helltide timer server started on 5124"); });
function hrTohhmmss(decimalTimeString) {
    let decimalTime = parseFloat(decimalTimeString);
    decimalTime = decimalTime * 60 * 60;
    let hours = Math.floor((decimalTime / (60 * 60)));
    decimalTime = decimalTime - (hours * 60 * 60);
    let minutes = Math.floor((decimalTime / 60));
    decimalTime = decimalTime - (minutes * 60);
    let seconds = Math.round(decimalTime);
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return "" + hours + ":" + minutes + ":" + seconds;
}
const recordedHelltideStart = 1686056400000;
const helltideTime = 60 * 60 * 1000; // 1hr
const helltideCooldown = 75 * 60 * 1000; // 1hr 15min
function getMessageToEdit(discordClient) {
    return new Promise((resolve, reject) => {
        discordClient.channels.fetch(process.env.DISCORD_CHANNEL).then((channel) => {
            if (channel === null) {
                console.error('no channel found with id: ' + process.env.DISCORD_CHANNEL);
                reject('no channel found with id: ' + process.env.DISCORD_CHANNEL);
                return;
            }
            channel.messages.fetch().then((messages) => {
                resolve(messages.get(process.env.DISCORD_CHANNEL_MESSAGE));
            }).catch(error => {
                console.error(error);
                reject(error);
            });
        });
    });
}
(async () => {
    (0, dotenv_1.config)();
    await (0, discord_1.discordLogin)(discord_1.default);
    await discord_1.default.channels.fetch(process.env.DISCORD_CHANNEL);
    let message;
    if (process.env.DISCORD_CHANNEL_MESSAGE) {
        message = await getMessageToEdit(discord_1.default);
    }
    let textChannel = discord_1.default.channels.cache.get(process.env.DISCORD_CHANNEL);
    setInterval(async () => {
        var now = new Date();
        var since = now - recordedHelltideStart;
        var timeleft = 0;
        var onCooldown = false;
        while (since > 0) {
            since -= (helltideTime);
            onCooldown = false;
            if (since > 0) {
                since -= helltideCooldown;
                onCooldown = true;
            }
        }
        timeleft = Math.abs(since);
        let timeleftInHrs = hrTohhmmss(timeleft / 1000 / 60 / 60);
        let embed = new discord_js_1.EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Helltide Timer Website')
            .setURL('https://helltidetimer.com/')
            .setAuthor({
            name: onCooldown ? 'Helltide is Over' : 'Helltide is Active',
        })
            .setThumbnail('https://helltidetimer.com/DiabloIV.png')
            .setFooter({ text: 'HelltideTimerBot' });
        let fields = [{ name: (onCooldown ? 'Active in ' : 'Over in ') + timeleftInHrs, value: '\u200B' }];
        embed.addFields(...fields);
        const messageToSend = { embeds: [embed] };
        if (message === undefined) {
            message = await textChannel.send(messageToSend);
            (0, updateEnv_1.default)("DISCORD_CHANNEL_MESSAGE", message.id);
            // console.log('message send and updated env ' + new Date().toUTCString())
        }
        else {
            await message.edit(messageToSend);
            // console.log('message updated ' + new Date().toUTCString())
        }
    }, 1000);
})();
//# sourceMappingURL=index.js.map