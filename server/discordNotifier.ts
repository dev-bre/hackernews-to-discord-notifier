import { DiscordNotification } from '@penseapp/discord-notification';
import dotenv from "dotenv";
dotenv.config();

const discordWebHook = process.env.DISCORD_WEBHOOK as string;
export const discordNotification = new DiscordNotification('HN-Notifier', discordWebHook);

export const notifyDiscord = (message: string, postId: string, postText: string, comments: number) : Promise<void> => {
    return discordNotification
    .sucessfulMessage()
    .addTitle(message)
    .addDescription(`[Link to the post](https://news.ycombinator.com/item?id=${postId})`)
    .addContent(postText)
    .addField({name: 'postId', value: postId, inline: true })
    .addField({name: 'comments', value: comments.toString() }) 
    .sendMessage();
};