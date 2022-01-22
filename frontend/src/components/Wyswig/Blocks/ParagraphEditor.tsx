import React, { useCallback } from "react";
import { createEditorStateWithText } from "@draft-js-plugins/editor";
import { EditorState } from "draft-js";
import { WyswigBlockEditor } from "../WyswigBlockEditor";
import { Container } from "react-bootstrap";
import { BlockEditor, TEMPLATE_EDITOR_BLOCK_TEXT } from "./EditorBlock";


export const ParagraphBlockEditor: BlockEditor = {
    blockType: 'Paragraph',
    create: (language) => ({
        blockType: 'Paragraph',
        editorState: createEditorStateWithText(TEMPLATE_EDITOR_BLOCK_TEXT[language]),
    }),
    Component: ({ state, readOnly, blockIndex, onChange }) => {
        const editorOnChange = useCallback((draft: EditorState, blockIndex: number) => {
            const state = {
                editorState: draft,
                blockType: 'Paragraph',
            };
            if (onChange) onChange(state, blockIndex);
        }, [onChange,]);
        const backgroundContainerPrefix = `jumbotron-${blockIndex % 2 === 0 ? 'light' : 'dark'}`;
        return <Container fluid bsPrefix={backgroundContainerPrefix}>
            <Container fluid="lg">
                <WyswigBlockEditor
                    readonly={readOnly}
                    onChange={editorOnChange}
                    blockIndex={blockIndex}
                    content={state.editorState}
                />
            </Container>
        </Container>
    },
};