const {parentPort} = require("worker_threads");
const axios = require("axios");
const cheerio = require("cheerio");

function getData(obj) {
    return new Promise(async (resolve, reject) => {
        let data = await axios.get(obj.url, obj.host);

        const $ = cheerio.load(data.data);

        const href = $("h5.seeprices-header");
        const hrefArray = [];

        for (let i = 0; i < href.length; i++) {
            hrefArray.push(obj.url.slice(0, -1) + $(href[i]).children("a").attr('href'));
        }

        resolve(hrefArray);
    })
}

parentPort.on('message', async (message) => {
    const data = await getData(message);
    message?.messagePort?.postMessage({hrefs : data, message : "done"});
});
