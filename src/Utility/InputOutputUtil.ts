export async function saveFile (dataPromise: Promise<Uint8Array<ArrayBufferLike> | undefined>)  {
    const data = await dataPromise;
    if (data == undefined) {
        console.error("No data received to save.");
        return;
    }

    // Create a Blob from the Uint8Array
    // Replace 'application/octet-stream' with your specific type (e.g., 'image/png')

    const stableData = new Uint8Array(data);
    const blob = new Blob([stableData], { type: 'application/octet-stream' });

    //Create a URL for the Blob and an anchor element to click on it
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = ('ExportierteDatenbank-' + new Date().toDateString() +  '.txt').replaceAll(" ", "-");

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export async function uInt8ArrayFromFile(fileList: FileList | null): Promise<Uint8Array<ArrayBuffer> | undefined>  {
    if (!fileList) {
        return;
    }
    const file = fileList[0];
    if (!file) {
        return;
    }
    try {
        const buffer = await file.arrayBuffer();
        const uint8 = new Uint8Array(buffer);

        console.log("File loaded as Uint8Array:", uint8);
        return uint8;
    } catch (error) {
        console.error("Error reading file:", error);
    }
}