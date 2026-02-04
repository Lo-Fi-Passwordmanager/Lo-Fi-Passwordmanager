import {beforeEach, describe, expect, it, vi} from "vitest";
import {saveFile, uInt8ArrayFromFile} from "../../src/Utility/InputOutputUtil";

describe('InputOutputUtil', ()=> {
    console.error = vi.fn();


    beforeEach(()=> {
        vi.resetAllMocks();
    })

    it('should be able to throw when saving an undefined file', async ()=> {
        console.error = vi.fn();
        await saveFile(Promise.resolve(undefined));
        expect(console.error).toHaveBeenCalledWith("No data received to save.")
    });

    it('should be able to save a file', async () => {
        const data = new Uint8Array([0, 1, 2]);
        await saveFile(Promise.resolve(data));
        //TODO testen das korrekt erstellt
    });

    it('uInt8Arrayfrom file should be undefined when input or FileList[0] is null', async ()=> {
        const array = await uInt8ArrayFromFile(null);
        expect(array).toBeUndefined();
        const array2 = await uInt8ArrayFromFile(emptyFileList);
        expect(array2).toBeUndefined();

    });

    it('should be able to get a Uint8Array from a file', async () => {
        const array = await uInt8ArrayFromFile(fileList);
        expect(array).toBeInstanceOf(Uint8Array);
    });

    it('should throw when the file is unable to be read correctly', async ()=> {
        console.error = vi.fn();
        const array = await uInt8ArrayFromFile(errorFileList);
        expect(array).toBeUndefined();
        expect(console.error).toHaveBeenCalled();
    });

    const mockFile = {
        arrayBuffer: vi.fn().mockResolvedValue(
            new TextEncoder().encode("salt: 123 validation: 123").buffer
        ),
    };
    const errorFile = new File(["error"], "error")

    const emptyFileList = {
        length: 0,
    } as unknown as FileList;

    const fileList = {
        0: mockFile,
        length: 1,
        item: (i: number) => mockFile,
    } as unknown as FileList;

    const errorFileList = {
        0: errorFile,
        length: 1,
        item: (i: number) => errorFile,
    } as unknown as FileList;
})