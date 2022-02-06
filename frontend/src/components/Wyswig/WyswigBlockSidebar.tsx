import React, { RefObject, useMemo, useState } from 'react';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dropdown, ListGroup, OverlayTrigger, Popover } from 'react-bootstrap';
import { ListItem } from 'react-bootstrap/lib/Media';
import { EditorActionType, EditorComponentAction } from './Blocks/useEditorBlocks';
import { BlockButtons } from './Blocks/EditorBlockRegistry';


interface WyswigBlockSidebarProps {
    dispatch: React.Dispatch<EditorComponentAction>,
    blockIndex: number,
}

export const WyswigBlockSidebar: React.FC<WyswigBlockSidebarProps> = ({ dispatch, blockIndex }) => {
    const [open, setOpen] = useState(false);
    const { onInjectBefore, onInjectAfter, onMutate, onDelete } = useMemo(() => ({
        onInjectAfter: (blockType: string) => {
            dispatch({
                type: EditorActionType.InsertBlockAfter,
                payload: {
                    blockType,
                    index: blockIndex
                }
            });
            setOpen(false);
        },
        onInjectBefore: (blockType: string) => {
            dispatch({
                type: EditorActionType.InsertBlockAfter,
                payload: {
                    blockType,
                    index: blockIndex - 1
                }
            });
            setOpen(false);
        },
        onMutate: (blockType: string) => {
            dispatch({
                type: EditorActionType.MutateBlockType,
                payload: {
                    blockType,
                    index: blockIndex,
                }
            });
            setOpen(false)
        },
        onDelete: () => {
            dispatch({
                type: EditorActionType.RemoveBlock,
                payload: blockIndex,
            });
            setOpen(false);
        }
    }), [dispatch, blockIndex]);


    return <Dropdown autoClose={false} show={open}>
        <Dropdown.Toggle id={`editor-sidebar-${blockIndex}`} onClick={() => setOpen(!open)}>
            Edit Block
        </Dropdown.Toggle>
        <Dropdown.Menu>
            <Dropdown.Item key={`Add-Before-${blockIndex}`} >
                <Dropdown>
                    <Dropdown.Toggle>Add Block Before</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <BlockButtons
                            onSelect={(label) => onInjectBefore(label)}
                            ButtonComponent={({label, onClick}) => <Dropdown.Item onClick={onClick}>{label}</Dropdown.Item>}
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </Dropdown.Item>
            <Dropdown.Item key={`Add-After-${blockIndex}`} >
                <Dropdown>
                    <Dropdown.Toggle>Add Block After</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <BlockButtons
                            onSelect={(label) => onInjectAfter(label)}
                            ButtonComponent={({label, onClick}) => <Dropdown.Item onClick={onClick}>{label}</Dropdown.Item>}
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </Dropdown.Item>
            <Dropdown.Item key={`Convert-To-${blockIndex}`} >
                <Dropdown>
                    <Dropdown.Toggle>Convert To</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <BlockButtons
                            onSelect={(label) => onMutate(label)}
                            ButtonComponent={({label, onClick}) => <Dropdown.Item onClick={onClick}>{label}</Dropdown.Item>}
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item key={`Delete-${blockIndex}`} onClick={onDelete}>Delete Block</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
}