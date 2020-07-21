const Discord = require("discord.js");
const CoinGecko = require("coingecko-api");
const config = require("./config.json");

const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);

const CoinGeckoClient = new CoinGecko();

const waitTime = config.interval * 60 * 1000;

const sendPrices = async () => {
  let data = await CoinGeckoClient.simple.price({
    ids: config.watchlist,
    vs_currencies: config.compare
  });
  var embed = {
    title: "Crypto Update",
    fields: []
  };
  for (const i in data.data) {
    for (const j in data.data[i]) {
      embed.fields.push({name: i + " -> " + j, value: data.data[i][j] })
    }
  }
  webhookClient.send("Crypto Prices", {embeds: [embed]})
}

const delay = async () => {
  return new Promise(resolve => setTimeout(resolve, waitTime));
}

(async () => {
  while (true) {
    await sendPrices();
    await delay();
  }
})();
