const {parentPort, workerData} = require("worker_threads");
const axios = require("axios");
const cheerio = require("cheerio");

function getData(obj) {
    return new Promise(async (resolve, reject) =>  {
        let data;
        try {
            data = await axios.get(obj.url, obj.host[Math.floor(Math.random() * obj.proxy.length)]);
        } catch (e) {
            try {
                data = await axios.get(obj.url, obj.host[Math.floor(Math.random() * obj.proxy.length)]);
            } catch (e) {
                try {
                    data = await axios.get(obj.url, obj.host[Math.floor(Math.random() * obj.proxy.length)]);
                } catch (e) {
                    data = await axios.get(obj.url, obj.host[Math.floor(Math.random() * obj.proxy.length)]);
                }

            }
        }

        const $ = cheerio.load(data.data);

        const element = $(`h5.seeprices-header`);
        const elementArray = [];

        for (let i = 0; i < element.length; i++) {
            elementArray.push(obj.url.slice(0, -1) + $(element[i]).children("a").attr('href'));
        }

        resolve({hrefs : elementArray, message : "done"});
    })

}



parentPort.on('message', async (message) => {
    const data = await getData(message);
    message?.messagePort?.postMessage(data);
});
