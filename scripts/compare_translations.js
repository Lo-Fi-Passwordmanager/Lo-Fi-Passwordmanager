import fs from "fs";
import path from "node:path";

const LOCALE_PATH = "./src/config/locales";

const keys = new Map();
const all_locales = [];
const all_namespaces = new Set();

for (const locale of fs.readdirSync(LOCALE_PATH)) {
    all_locales.push(locale);
    const folderPath = path.join(LOCALE_PATH, locale);
    for (const namespace_file of fs.readdirSync(folderPath)) {
        all_namespaces.add(namespace_file);
        // console.log(`Sorting [${locale}] ${namespace}`);
        const filePath = path.join(folderPath, namespace_file);
        const fileData = fs.readFileSync(filePath);
        let data = "";
        try {
            data = JSON.parse(fileData);
        } catch (e) {
            continue;
        }


        const paths = getPaths(data);

        for (const key of paths) {
            if (keys.has(namespace_file)) {
                let namespace = keys.get(namespace_file);
                if (namespace.has(key)) {
                    const locales = namespace.get(key);
                    namespace.set(key, [...locales, locale]);
                } else {
                    namespace.set(key, [locale]);
                }
            } else {
                let namespace = new Map();
                namespace.set(key, [locale]);
                keys.set(namespace_file, namespace);
            }
        }
    }
}

for (const locale of all_locales) {
    const local_missing_namespaces = structuredClone(all_namespaces);
    const folderPath = path.join(LOCALE_PATH, locale);
    for (const namespace_file of fs.readdirSync(folderPath)) {
        local_missing_namespaces.delete(namespace_file);
    }
    if (local_missing_namespaces.size > 0) {
        console.log(`Locale "${locale}" is missing the following namespaces present in other languages:`);
        local_missing_namespaces.forEach((entry, _) => console.log(entry));
    }
    console.log("");

    let availabe_namespaces = all_namespaces.difference(local_missing_namespaces);


    for (const namespace of availabe_namespaces) {
        const missing_keys = [];
        const namespace_keys = keys.get(namespace);
        if (!namespace_keys || namespace_keys.size == 0) {
            continue;
        }
        for (const [key, v] of namespace_keys) {
            if (!v.includes(locale)) {
                missing_keys.push(key);
            }
        }

        missing_keys.sort();

        if (missing_keys.length > 0) {
            console.log(`[${locale}] ${namespace} is missing the following keys present in other languages:`);

            for (const key of missing_keys) {
                console.log(key);
            }
        }
    }
    console.log("------------------------------");
}


function getPaths(obj, currentPath = "") {
    let paths = [];

    for (const key in obj) {
        // Construct the new path string
        const newPath = currentPath ? `${currentPath}.${key}` : key;

        if (typeof obj[key] === "object" && obj[key] !== null) {
            paths.push(...getPaths(obj[key], newPath));
        } else {
            paths.push(newPath);
        }
    }

    return paths;
}