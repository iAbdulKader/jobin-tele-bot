const express = require("express");
const { Telegraf } = require('telegraf');
const axios = require('axios');
const { wakeDyno } = require('heroku-keep-awake');
require("dotenv").config();
const bot = new Telegraf(process.env.bot_api_key)

const DYNO_URL = process.env.base_url;
const opts = {
    interval: 25,
    logging: false,
    stopTimes: { start: '18:50', end: '02:00' }
}


const app = express();

app.get("/", (req, res) => {
  res.send("Bot Running")
})

bot.start(async (ctx) => {
  ctx.replyWithHTML("<em>Hello There 👋, I am <b>Jobin Bot</b> \nSend me any text, code snipets and I will give you <i>Jobin url and its raw url</i></em>\n\n <b>Press /help for more info.</b>\n\n<em>Owner @itsabdulkader</em>");
});

bot.command('help', (ctx) => {
  ctx.replyWithHTML("<em>📤 Send me any text or code and I paste that to <b>jobin</b> and give you jobin's link as well as it's raw link. Example-\n\n<code>https://jobin.tk/abdcdef</code></em>");
});


// api_key = Jb-IOE5Bye086pAY
bot.on('message', async(ctx) => {
    var message = ctx.message.text
    if (message == undefined) {
        ctx.replyWithHTML("<em>❗You are sending file. Send a valid Link to Shorten it.</em>")
    }
    else {
        var config = {
            method: 'post',
            url: "https://jobin.tk/create",
            data: {
              value: message
            }
        };
        axios(config)
            .then(async function(response) {
                var data = response.data;
                if (data.status == true) {
                    ctx.replyWithHTML(`<em>✔️ Your Jobin Link (Tap to Copy):</em>\n\n<code>${data.binUrl}</code>\n<code>${data.rawUrl}</code>`)
                    
                }
                else {
                    ctx.replyWithHTML("<em>Try again</em>")
                }
            })
            .catch(function(error) {
                ctx.replyWithHTML("<em>📮 Contact owner</em>")
                console.log(error)
            })
    }
})






bot.launch();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  wakeDyno(DYNO_URL, opts);
});
