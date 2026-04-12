import fs from "fs";
import path from "node:path";

const LOCALE_PATH = "./src/config/locales";

for (const folder of fs.readdirSync(LOCALE_PATH)) {
    const folderPath = path.join(LOCALE_PATH, folder);
    for (const file of fs.readdirSync(folderPath)) {
        console.log(`Sorting [${folder}] ${file}`);
        const filePath = path.join(folderPath, file);
        const data = JSON.parse(fs.readFileSync(filePath));
        const sorted_data = sortObjectKeys(data);
        const sorted_json = JSON.stringify(sorted_data, undefined, 2);
        fs.writeFileSync(filePath, sorted_json);
    }
}

function sortObjectKeys(obj) {
    // sort keys and recurse
    if (obj !== null && typeof obj === "object") {
        return Object.keys(obj)
            .sort()
            .reduce((acc, key) => {
                acc[key] = sortObjectKeys(obj[key]);
                return acc;
            }, {});
    }

    // Return non objects without modifying
    return obj;
}