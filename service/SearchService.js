const manualSchema = require("../module/ManualSchema");

const addManual = (manual) => {
    return new Promise((resolve, reject) => {
            const newManual = new manualSchema({
                "brand": manual.brand,
                "category": manual.category,
                "url": manual.url,
                "title": manual.title,
                "parsingDate": new Date().toString()
            })
            newManual.save((err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve("ok")
                }
            })
    })
}

const addManualArray = (manual) => {
    return new Promise((resolve, reject) => {
        manualSchema.insertMany(manual)
            .then(resolve)
            .catch(reject)
    })
}

module.exports = {addManual, addManualArray};
