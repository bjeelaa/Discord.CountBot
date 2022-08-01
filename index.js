const { Client, Intents, Collection } = require("discord.js");
const botConfig = require("./botConfig.json");
const fs = require("fs");

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS]
});

client.once("ready", () => {
    console.log(`${client.user.username} is online`);
    client.user.setActivity('to you idiots', { type: "LISTENING" });
});

client.on("messageDelete", async message => {
    if (!message.channel == message.guild.channels.cache.get("822462440201125960")) return;
    var count = JSON.parse(fs.readFileSync("./count.json", "UTF8"));
    if (message.id.toString() == count["lastID"]) {
        message.channel.send(`<@${count["last"]}> deleted their count of **${count["count"]}**, the next number is **${count["count"] + 1}**`).then(msg => {
            count["lastID"] = msg.id;
            return fs.writeFile("./count.json", JSON.stringify(count), (err) => {
                if (err) console.log(err);
            });
        });
    }
});

client.on("messageCreate", async message => {
    if (message.author.bot) return;
    var messageArray = message.content.split(" ");

    let channel = message.guild.channels.cache.get("822462440201125960");
    if (message.channel == channel) {
        if (message.attachments.size > 0) return;
        if (isNaN(messageArray[0])) return;
        var count = JSON.parse(fs.readFileSync("./count.json", "UTF8"));
        if(count["count"] == 0 && messageArray[0] != 1) return message.react("😔");
        if (message.author.id.toString() == count["last"]) {
            message.react("❌");
            message.channel.send(`😵‍💫<@${message.author.id}> **RUINED** the count at **${count["count"]}** by counting twice in a row...😵‍💫`);
            if (count["hs"] < count["count"]) {
                message.channel.send(`🏆**NEW HIGHSCORE: ${count["count"]}** *Old highscore: ${count["hs"]}*🏆`)
                count["hs"] = count["count"];
                channel.setTopic(`Highscore: ${count["hs"]}`);
                count["trophied"] = 0;
            }
            count["count"] = 0;
            count["last"] = '';
            count["lastID"] = '';
        } else if (messageArray[0] == count["count"] + 1) {
            count["count"]++;
            if (count["hs"] < count["count"] && count["trophied"] == 0) {
                message.react("🏆");
                count["trophied"] = 1;
            } else if (count["count"] % 100 == 0) message.react("💯");
            else if(count["count"] == 69 || count["count"] == 696 || count["count"] == 6969 || count["count"] == 69696 || count["count"] == 696969 || count["count"] == 6969696) {message.react("💦");message.react("🔞");message.react("🍆");message.react("🥵");}
            else if(count["count"] == 420) message.react("<:weed:990740734246273095>")
            else message.react("✅");
            count["last"] = message.author.id.toString();
            count["lastID"] = message.id;
        } else {
            message.channel.send(`😵‍💫<@${message.author.id}> **RUINED** the count at **${count["count"]}**😵‍💫`);
            message.react("❌");
            if (count["hs"] < count["count"]) {
                message.channel.send(`🏆 **NEW HIGHSCORE: ${count["count"]}** *Old highscore: ${count["hs"]}* 🏆`)
                count["hs"] = count["count"];
                channel.setTopic(`Highscore: ${count["hs"]}`);
                count["trophied"] = 0;
            }
            count["count"] = 0;
            count["last"] = '';
            count["lastID"] = '';
        }
        return fs.writeFile("./count.json", JSON.stringify(count), (err) => {
            if (err) console.log(err);
        });
    }
});

client.login(botConfig.token);