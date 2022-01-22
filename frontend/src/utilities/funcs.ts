import { RawDraftContentState } from "draft-js";


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

export const resizeImage = (file: File, bbox: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const img = document.createElement("img");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        reader.onload = (e) => {
            img.src = e.target?.result as string;
            const maxHeight = bbox;
            const maxWidth = bbox;
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/png");
            resolve(dataUrl);
        }
        reader.readAsDataURL(file);
    });
}