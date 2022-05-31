const {parentPort} = require("worker_threads");
const axios = require("axios");
const cheerio = require("cheerio");

function getFirstData(obj) {
    return new Promise(async (resolve, reject) => {
        let data = await axios.get(obj.url, obj.host[Math.floor(Math.random() * obj.host.length)]);

        const $ = cheerio.load(data.data);

        const href = $("h5.seeprices-header");
        const hrefArray = [];

        for (let i = 0; i < href.length; i++) {
            hrefArray.push(obj.url.slice(0, -1) + $(href[i]).children("a").attr('href'));
        }

        resolve({hrefs : hrefArray, message : "done"});
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
            elementArray.push("http://www.manualsonline.com" + $(element[i]).children("a").attr('href'));
        }

        console.log("ok")
        resolve({hrefs : elementArray, message : "done2"});
    })

}

function getThirdData(obj) {
    return new Promise(async (resolve, reject) =>  {
        try {
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
                        try {
                            data = await axios.get(obj.url, obj.host[Math.floor(Math.random() * obj.host.length)]);
                        } catch (e) {
                            data = await axios.get(obj.url, obj.host[Math.floor(Math.random() * obj.host.length)]);
                        }
                    }

                }
            }

            const $ = cheerio.load(data.data);

            const brand = $(`#brands-list > div.brands > ul > li`).text().replace(/[^a-zA-Z0-9 ]/g, '').trim();
            const category = $(`#left-sidebar-nav > div.brands.brand > ul > li`).text().replace(/[^a-zA-Z0-9 ]/g, '').trim();

            const finalObject = $("div.col-md-8.col-sm-8.col-xs-7 > h5");
            const finalObjectsArray = [];

            for (let i = 0; i < finalObject.length; i++) {
                finalObjectsArray.push({brand, category, "url":  "http://www.manualsonline.com" + $(finalObject[i]).children("a").attr('href'), "title": $(finalObject[i]).children("a").text().replace(/[^a-zA-Z0-9 ]/g, '').trim()});
            }

            finalObjectsArray.forEach(obj => {
                console.log(obj);
            })

            resolve({message : "done3"});

        } catch (e) {
            resolve({message : "done3"});
        }
    })

}


parentPort.on('message', async (message) => {
    if (message.message === "first") {
        const data = await getFirstData(message);
        parentPort.postMessage(data);
    }
    if (message.message === "second") {
        const data = await getSecondData(message);
        parentPort.postMessage(data);
    }

    if (message.message === "third") {
        const data = await getThirdData(message);
        console.log(data);
        parentPort.postMessage(data);
    }
});
