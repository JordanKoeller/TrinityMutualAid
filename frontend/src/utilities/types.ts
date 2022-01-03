import { RawDraftContentState } from "draft-js";
import { Language } from "../i18n";


export interface ArticleDescription {
    title: string,
    articleId: number,
    language: Language,
    content: RawDraftContentState,
    author: string,
    publicationDate: Date,
}