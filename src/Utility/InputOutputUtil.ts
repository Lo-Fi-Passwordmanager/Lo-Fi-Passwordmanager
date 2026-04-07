export async function saveFile(dataPromise: Promise<Uint8Array<ArrayBufferLike> | undefined>) {
    const data = await dataPromise;
    if (data == undefined) {
        console.error("No data received to save.");
        return;
    }

    // Create a Blob from the Uint8Array
    // Replace 'application/octet-stream' with your specific type (e.g., 'image/png')

    const stableData = new Uint8Array(data);
    const blob = new Blob([stableData], {type: "application/octet-stream"});

    //Create a URL for the Blob and an anchor element to click on it
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = ("ExportierteDatenbank-" + new Date().toDateString() + ".encpwdb").replaceAll(" ", "-");

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export async function uInt8ArrayFromFile(fileList: FileList | null): Promise<Uint8Array<ArrayBuffer> | undefined> {
    if (!fileList) {
        return;
    }
    const file = fileList[0];
    if (!file) {
        return;
    }
    try {
        const buffer = await file.arrayBuffer();
        return new Uint8Array(buffer);
    } catch (error) {
        console.error("Error reading file:", error);
    }
};

export function saveToCsv(lines : string[]) {
    try {
        const fullContent = lines.join('\n');

        // Create a Blob with the CSV content and correct MIME type
        const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', "Database.csv");


        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        console.log(`Download triggered for: "Database.csv"`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Download failed:', error.message);
        } else {
            console.error('An unknown error occurred during download');
        }
    }
};

export async function loadFromCsv(fileList: FileList): Promise<string[] | undefined> {
    try {
        const file = fileList[0];
        if (!file) {
            console.warn("No file found in FileList.");
            return undefined;
        }

        const content = await file.text();


        const lines = content
            //Regex for windows and linux
            .split(/\r?\n/)
            .filter(line => line.trim() !== "");

        console.log(`Parsed ${lines.length} lines from: ${file.name}`);
        return lines;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Load failed:', error.message);
        } else {
            console.error('An unknown error occurred during file load');
        }
        return undefined;
    }
}