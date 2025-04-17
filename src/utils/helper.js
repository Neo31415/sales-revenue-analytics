const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const convertToObject = (str) => {
    try {
        const fixed = str.replace(/'/g, '"');
        return JSON.parse(fixed);
    } catch (err) {
        console.error("Failed to convert string to object:", err.message);
        return null;
    }
};

const parseCSV = async (filename) => {
    const filePath = path.join(__dirname, "../migrations/data", filename);
    const results = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", reject);
    });
};

module.exports = {
    parseCSV,
    convertToObject,
};
