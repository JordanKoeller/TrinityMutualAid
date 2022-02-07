import React, { useCallback } from "react";
import { createEditorStateWithText } from "@draft-js-plugins/editor";
import { EditorState } from "draft-js";
import { WyswigBlockEditor } from "../WyswigBlockEditor";
import { Container } from "react-bootstrap";
import { BlockEditor, BlockEditorComponent, TEMPLATE_EDITOR_BLOCK_TEXT } from "./EditorBlock";

const ParagraphEditorComponent: (justify: "left" | "center" | "right", blockType: string) => BlockEditorComponent = (justify, blockType) => {
    const useBlock: BlockEditorComponent = ({ state, readOnly, blockIndex, onChange, Sidebar }) => {
        const editorOnChange = useCallback((draft: EditorState, blockIndex: number) => {
            const state = {
                editorState: draft,
                blockType: blockType,
            };
            if (onChange) onChange(state, blockIndex);
        }, [onChange,]);
        const backgroundContainerPrefix = `jumbotron-${blockIndex % 2 === 0 ? 'light' : 'dark'}`;
        return <Container fluid bsPrefix={backgroundContainerPrefix}>
            <Container fluid="lg">
                <div className="wyswig-block-row">
                    {Sidebar}
                    <WyswigBlockEditor
                        justify={justify}
                        readonly={readOnly}
                        onChange={editorOnChange}
                        blockIndex={blockIndex}
                        content={state.editorState}
                    />
                </div>
            </Container>
        </Container>
    }
    return useBlock
}

export const ParagraphBlockEditor: BlockEditor = {
    blockType: 'Paragraph',
    create: (language) => ({
        blockType: 'Paragraph',
        editorState: createEditorStateWithText(TEMPLATE_EDITOR_BLOCK_TEXT[language]),
    }),
    Component: ParagraphEditorComponent("left", "Paragraph"),
};

export const CenteredParagraphBlockEditor: BlockEditor = {
    blockType: "CenteredParagraph",
    create: (language) => ({
        blockType: 'CenteredParagraph',
        editorState: createEditorStateWithText(TEMPLATE_EDITOR_BLOCK_TEXT[language]),
    }),
    Component: ParagraphEditorComponent("center", "CenteredParagraph")
}
