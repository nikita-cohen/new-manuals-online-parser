const {Worker, workerData} = require("worker_threads");
const {MessageChannel} = require("node:worker_threads");
const axios = require("axios");
const path = require("path");
const express = require('express');
const app = express();

let AMOUNT = 20;
let workers = [];
const data = [
    "http://babycare.manualsonline.com/",
    "http://caraudio.manualsonline.com/",
    "http://cellphone.manualsonline.com/",
    "http://phone.manualsonline.com/",
    "http://office.manualsonline.com/",
    "http://fitness.manualsonline.com/",
    "http://audio.manualsonline.com/",
    "http://homeappliance.manualsonline.com/",
    "http://kitchen.manualsonline.com/",
    "http://laundry.manualsonline.com/",
    "http://lawnandgarden.manualsonline.com/",
    "http://marine.manualsonline.com/",
    "http://music.manualsonline.com/",
    "http://outdoorcooking.manualsonline.com/",
    "http://personalcare.manualsonline.com/",
    "http://camera.manualsonline.com/",
    "http://portablemedia.manualsonline.com/",
    "http://powertool.manualsonline.com/",
    "http://tv.manualsonline.com/",
    "http://videogame.manualsonline.com/"];
let queue = [];
let queue2 = [];
let userAgent = [{'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246', 'Accept-Language' : '*'}
    , {'User-Agent' : "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36", 'Accept-Language' : '*'},
    {'User-Agent' : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9", 'Accept-Language' : '*'},
    {'User-Agent' : "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1", 'Accept-Language' : '*'},
    {'User-Agent' : "Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36", 'Accept-Language' : '*'},
    {'User-Agent' : "APIs-Google (+https://developers.google.com/webmasters/APIs-Google.html)", 'Accept-Language' : '*'}
]
let hostObj = [];

function createProxyHost() {
    axios.get("https://rootfails.com/proxy/f021011c43b83a07a58d3708aed53f5b").then(data => {
        let host = data.data.split("\n");

        host.forEach(proxy => {

            const obj = {};
            obj.host = proxy.split(":")[0];
            obj.port = proxy.split(":")[1];
            obj.headers = userAgent[Math.floor(Math.random() * 6)]
            obj.proxy = {};
            obj.proxy.host = proxy.split(":")[0];
            obj.proxy.port = proxy.split(":")[1];
            obj.proxy.headers = userAgent[Math.floor(Math.random() * 6)]

            hostObj.push(obj);
        })
    })
}

function createWorkers (patha) {
    for (let i = 0; i < AMOUNT; i++) {
        const w = new Worker(path.resolve(patha));
        const subChannel = new MessageChannel();
        workers.push({
            worker: w,
            channels: {
                port1: subChannel.port1,
                port2: subChannel.port2,
            }
        });
    }
}

function initWorker(url , idx) {
    return new Promise((resolve, reject) => {
        const {worker, channels} = workers[idx];

        worker.postMessage({message : "first", url, host : hostObj, messagePort: channels.port1 }, [channels.port1]);

        channels.port2.on('message', async (message) => {
            console.log(message.message)
            if (message.message === "done") {
                queue = [...queue, ...message.hrefs];
                if (queue.length > 0) {
                    worker.postMessage({message : "second", url : queue.shift(), host : hostObj, messagePort: channels.port2 }, [channels.port2]);
                }
            }

            if (message.message === "done2") {
                queue2 = [...queue2, ...message.hrefs];
                if (queue.length > 0) {
                    worker.postMessage({message : "second", url : queue.shift(), host : hostObj, messagePort: channels.port2}, [channels.port2]);
                } else {
                    resolve(message)
                }
                // if (queue2.length > 0) {
                //     worker.postMessage({message : "second", url : queue2.shift(), host : hostObj[Math.floor(Math.random() * hostObj.length)], messagePort: channels.port1 }, [channels.port1]);
                // }
            }
        });

        worker.on('error', error => {
            reject(error);
        })

        worker.on("exit", (code) => {
            if (code !== 0) reject(new Error("something go wrong"));
        })
    })
}


function loadArray () {
    return new Promise((resolve, reject) => {
        Promise.all(data.map(initWorker)).then(resolve).catch(reject);
    });
}

async function initLoadingArray () {
    console.time('image_array');
    await loadArray();
    console.timeEnd('image_array');
}

function init () {
    app.listen(3006, async() => {
        try {
            console.log('listening port 3006');
            createProxyHost();
            createWorkers("./workerThread.js");

            await initLoadingArray();

            console.log(queue2)

        }
        catch(e) {
            console.log('e', e);
        }
    })
}

init();


