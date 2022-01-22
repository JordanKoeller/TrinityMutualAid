import { EditorState, RawDraftContentState } from "draft-js";
import { Language } from "../i18n";

export enum BlockType {
    Paragraph,
    SplitPanel,
    NewsCard,
}

interface EditorBlockTemplate<T> {
    editorState: T,
    blockType: string,
    data?: any,
}

export type EditorBlock = EditorBlockTemplate<EditorState>;
export type RawEditorBlock = EditorBlockTemplate<RawDraftContentState>;




export interface ArticleDescription {
    blocks: EditorBlock[],
    language: Language,
    articleId?: number,
    publicationDate?: Date,
    author?: string,

}