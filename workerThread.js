const {parentPort} = require("worker_threads");
const axios = require("axios");
const cheerio = require("cheerio");

function getFirstData(obj) {
    return new Promise(async (resolve, reject) => {
        let data = await axios.get(obj.url, obj.host[Math.floor(Math.random() * hostObj.length)]);

        const $ = cheerio.load(data.data);

        const href = $("h5.seeprices-header");
        const hrefArray = [];

        for (let i = 0; i < href.length; i++) {
            hrefArray.push(obj.url.slice(0, -1) + $(href[i]).children("a").attr('href'));
        }

        resolve(hrefArray);
    })
}

function getSecondData(obj) {
    return new Promise(async (resolve, reject) =>  {
        let data;
        try {
            data = await axios.get(obj.url, obj.host[Math.floor(Math.random() * obj.host.length)]);
        } catch (e) {
            try {
                data = await axios.get(obj.url, obj.host[Math.floor(Math.random() * obj.host.length)]);
            } catch (e) {
                try {
                    data = await axios.get(obj.url, obj.host[Math.floor(Math.random() * obj.host.length)]);
                } catch (e) {
                    data = await axios.get(obj.url, obj.host[Math.floor(Math.random() * obj.host.length)]);
                }

            }
        }

        const $ = cheerio.load(data.data);

        const element = $(`h5.seeprices-header`);
        const elementArray = [];

        for (let i = 0; i < element.length; i++) {
            elementArray.push(obj.url.slice(0, -1) + $(element[i]).children("a").attr('href'));
        }

        resolve({hrefs : elementArray, message : "done2"});
    })

}

parentPort.on('message', async (message) => {
    if (message.message === "first") {
        const data = await getFirstData(message);
        message?.messagePort?.postMessage(data);
    }
    if (message.message === "second") {
        const data = await getSecondData(message);
        message?.messagePort?.postMessage(data);
    }

});
