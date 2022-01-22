import React, { useCallback } from "react";
import { createEditorStateWithText } from "@draft-js-plugins/editor";
import { EditorState } from "draft-js";
import { WyswigBlockEditor } from "../WyswigBlockEditor";
import { BlockEditor } from "./useEditorBlocks";
import { Container } from "react-bootstrap";


export const ParagraphBlockEditor: BlockEditor = {
    blockType: 'Paragraph',
    create: () => ({
        blockType: 'Paragraph',
        editorState: createEditorStateWithText("Enter text here."),
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