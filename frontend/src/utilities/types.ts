import { EditorState } from "draft-js";
import { Language } from "../i18n";

export interface EditorBlock {
    editorState: EditorState,
}

export interface ArticleDescription {
    blocks: EditorBlock[],
    language: Language,
    articleId?: number,
    publicationDate?: Date,
    author?: string,

}