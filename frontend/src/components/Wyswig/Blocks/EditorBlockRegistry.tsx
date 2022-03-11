
import { Button, ButtonGroup } from 'react-bootstrap';
import { Language } from '../../../i18n';
import { CardEditor } from './CardEditor';
import { BlockEditor, BlockEditorComponent, EditorBlock } from './EditorBlock';
import { CenteredParagraphBlockEditor, ParagraphBlockEditor } from './ParagraphEditor';
import { SplitPanelEditor } from './SplitPanelEditor';
import { EditorActionType, EditorComponentAction } from './useEditorBlocks';

const blockRegistry: Record<string, BlockEditor> = {};


export function createNewBlock(blockType: string, lang: Language): EditorBlock {
    if (blockType in blockRegistry) {
        return blockRegistry[blockType].create(lang);
    }
    throw new Error(`BlockType ${blockType} not registered in the BlockTypeRegistry.`);
}

export function getBlockEditorComponent(blockType: string): BlockEditorComponent {
    if (blockType in blockRegistry) {
        return blockRegistry[blockType].Component;
    }
    throw new Error(`BlockType ${blockType} not registered in the BlockTypeRegistry.`);
}

export function getBlockEditor(blockType: string): BlockEditor {
    if (blockType in blockRegistry) {
        return blockRegistry[blockType];
    }
    throw new Error(`BlockType ${blockType} not registered in the BlockTypeRegistry.`);
}


export const AddBlockButtons: React.FC<{ dispatch: (action: EditorComponentAction) => void }> = ({ dispatch }) => {
    return <ButtonGroup>
        {
            Object.values(blockRegistry).map(blockEditor => <Button
                variant="primary"
                size="lg"
                key={blockEditor.blockType}
                onClick={() => dispatch({ type: EditorActionType.AddBlock, payload: blockEditor.blockType })}
            >Add {blockEditor.blockType}</Button>)
        }
    </ButtonGroup>
}

interface BlockButtonProps {
    ButtonComponent: React.FC<{label: string, onClick: () => void}>;
    onSelect: (name: string) => void;
}

export const BlockButtons: React.FC<BlockButtonProps> = ({ButtonComponent, onSelect}) => {
    return <>
        {
            Object.keys(blockRegistry).map(label => 
                <ButtonComponent key={label} label={label} onClick={() => onSelect(label)} />
            )
        }
    </>
}

function registerBlockEditor(editor: BlockEditor) {
    blockRegistry[editor.blockType] = editor;
}

registerBlockEditor(ParagraphBlockEditor);
registerBlockEditor(SplitPanelEditor);
registerBlockEditor(CenteredParagraphBlockEditor);
registerBlockEditor(CardEditor);