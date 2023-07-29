"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyDiscord = exports.discordNotification = void 0;
const discord_notification_1 = require("@penseapp/discord-notification");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const discordWebHook = process.env.DISCORD_WEBHOOK;
exports.discordNotification = new discord_notification_1.DiscordNotification('HN-Notifier', discordWebHook);
const notifyDiscord = (message, postId, postText, comments) => {
    return exports.discordNotification
        .sucessfulMessage()
        .addTitle(message)
        .addDescription(`[Link to the post](https://news.ycombinator.com/item?id=${postId})`)
        .addContent(postText)
        .addField({ name: 'postId', value: postId, inline: true })
        .addField({ name: 'comments', value: comments.toString() })
        .sendMessage();
};
exports.notifyDiscord = notifyDiscord;
