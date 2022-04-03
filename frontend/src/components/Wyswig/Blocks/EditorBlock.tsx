
import { EditorState, RawDraftContentState } from 'draft-js';
import { Language } from '../../../i18n';

/**
 * 
 * I kind of hate Facebook's interfaces/apis for Draft.js. So I'm just going to wrap it in one that makes sense to me.
 * 
 * I get it's flexible and extensible, and maybe for extremely advanced editors that flexibility is good. But I don't need it.
 * 
 * To make a Block editor, you just make a subclass of the class below. A "Block" is a section of vertical space on the screen,
 * or an otherwise discrete section of a document. The ones that exist right now are for a paragraph, a Splitpanel with an image
 *   on one side and text on the other, and then finally, a news card.
 * 
 */

export const TEMPLATE_EDITOR_BLOCK_TEXT: Record<Language, string> = {
    [Language.English]: "Enter text here",
    [Language.Spanish]: "Introducir texto aquí",
}

interface EditorBlockTemplate<T> {
   editorState: T,
   blockType: string,
   data?: any,
}

export type EditorBlock = EditorBlockTemplate<EditorState>;
export type RawEditorBlock = EditorBlockTemplate<RawDraftContentState>;


 export interface SerializedBlockEditor {
    blockType: string,
    content: EditorState,
}

interface BlockEditorComponentProps {
    Sidebar: React.ReactElement | null,
    state: EditorBlock,
    blockIndex: number,
    readOnly?: boolean,
    onChange?: (state: EditorBlock, index: number) => void,
}

export type BlockEditorComponent = React.FC<BlockEditorComponentProps>;

export interface BlockEditor {
    blockType: string,
    Component: BlockEditorComponent,
    create: (lang: Language) => EditorBlock,
    // Grab any images, upload them, inject their URLs into the block, and return the urls in an array of strings.
    scrubImages?: (block: EditorBlock, imageRecord: Record<string, File>) => void,
    replaceImages?: (block: EditorBlock, imagesToUrl: Record<string, string>) => void,
    replicateAcrossLanguage?: (changedBlock: EditorBlock, destinationBlock: EditorBlock) => EditorBlock, 
}