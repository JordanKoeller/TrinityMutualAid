import { RawDraftContentState } from "draft-js";
import Resizer from 'react-image-file-resizer';
import { sha256 } from 'js-sha256'; 

export const groupBy = <T>(array: T[], groupSize: number): T[][] => {
    return array.reduce((agg, elem) => {
        if (agg[agg.length - 1].length === groupSize) {
            return [...agg, [elem]];
        } else {
            agg[agg.length - 1].push(elem);
            return agg;
        }
    }, [[]] as T[][]);
}

export const dataUrlToFile = (data: string, filename?: string): File => {
    console.log("data: ", data);
    const arr = data.split(',')
    const mime = (arr[0].match(/:(.*?);/) as any)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    const fname = filename || `${Math.round(Math.random() * 100000000)}.${mime.split('/')[1]}`

    return new File([u8arr], fname, { type: mime });
}

export const getImageDataFromRawEditorState = (state: RawDraftContentState): File[] => {
    return Object.values(state.entityMap)
        .filter(entity => entity.type === 'IMAGE')
        .map(entity => dataUrlToFile(entity.data.src))
}

export const resizeImage = (file: File, bbox: number): Promise<File> => {
    return new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            bbox,
            bbox,
            'png',
            80,
            0,
            (value) => resolve(value as File),
            'file'
        )
    });
}

export function mapEntries<K extends string | number | symbol, V, U>(obj: Record<K, V>, func: (entry: [K, V]) => [K, U]): Record<K, U> {
    return Object.fromEntries(Object.keys(obj).map(k => func([k as K, obj[k as K]]))) as Record<K, U>;
}

export function getHashFromBlob(blob: Blob): Promise<string> {
    const reader = new FileReader();
    const hasher = sha256.create();
    return new Promise((resolve) => {
        reader.addEventListener('loadend', () => {
            hasher.update(reader.result as string);
            resolve(hasher.hex());
        });
        reader.readAsArrayBuffer(blob);
    })
}