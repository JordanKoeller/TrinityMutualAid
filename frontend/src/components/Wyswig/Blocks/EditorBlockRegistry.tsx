
import { Button, ButtonGroup } from 'react-bootstrap';
import { EditorBlock } from '../../../utilities/types';
import { ParagraphBlockEditor } from './ParagraphEditor';
import { SplitPanelEditor } from './SplitPanelEditor';
import { BlockEditor, BlockEditorComponent, EditorActionType, EditorComponentAction } from './useEditorBlocks';

const blockRegistry: Record<string, BlockEditor> = {};


export function createNewBlock(blockType: string): EditorBlock {
    if (blockType in blockRegistry) {
        return blockRegistry[blockType].create();
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
                variant="primary-outlined"
                size="lg"
                onClick={() => dispatch({ type: EditorActionType.AddBlock, payload: blockEditor.blockType })}
            >Add {blockEditor.blockType}</Button>)
        }
    </ButtonGroup>
}

function registerBlockEditor(editor: BlockEditor) {
    blockRegistry[editor.blockType] = editor;
}

registerBlockEditor(ParagraphBlockEditor);
registerBlockEditor(SplitPanelEditor);