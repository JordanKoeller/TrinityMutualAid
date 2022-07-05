import { EditorBlock } from "../components/Wyswig/Blocks/EditorBlock";
import { Language } from "../i18n";

export enum BlockType {
    Paragraph,
    SplitPanel,
    NewsCard,
}




export interface ArticleDescription {
    blocks: EditorBlock[],
    language: Language,
    articleId?: number,
    publicationDate?: Date,
    author?: string,

}