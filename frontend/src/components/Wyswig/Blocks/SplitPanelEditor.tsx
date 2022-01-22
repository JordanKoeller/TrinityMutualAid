import React, { useCallback } from "react";
import { createEditorStateWithText } from "@draft-js-plugins/editor";
import { BlockEditor } from "./useEditorBlocks";
import { EmptySplitPanel } from "../../SplitPanel";
import { ParagraphBlockEditor } from "./ParagraphEditor";
import { EditorState } from "draft-js";
import { WyswigBlockEditor } from "../WyswigBlockEditor";

export const SplitPanelEditor: BlockEditor = {
    blockType: 'SplitPanel',
    create: () => ({
        blockType: 'SplitPanel',
        editorState: createEditorStateWithText("Enter Text Here"),
        data: "insertImage.jpg",
    }),
    Component: ({ state, readOnly, blockIndex, onChange }) => {
        console.log("Rendering SplitPanelEditor");
        const handleUploadChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                const file = evt.target.files?.[0]!;
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    onChange({
                        ...state,
                        data: reader.result as string,
                    }, blockIndex);
                }
            }
        }
        const editorOnChange = useCallback((draft: EditorState, blockIndex: number) => {
            const nextState = {
                ...state,
                editorState: draft,
            };
            if (onChange) onChange(nextState, blockIndex);
        }, [onChange, state]);
        return <EmptySplitPanel
            variant={blockIndex % 2 === 0 ? 'light' : 'dark'}
            Left={            <div>
                {readOnly ? null : <>
                  <input type="file" onChange={handleUploadChange} />
                </>}
                <img src={state.data as string} alt="" style={{
                    width: '90%',
                    height: '90%',
                    objectFit: 'contain',
                }} />
            </div>}
            Right={<WyswigBlockEditor
                readonly={readOnly}
                onChange={editorOnChange}
                blockIndex={blockIndex}
                content={state.editorState}
            />}
        />  
    },
    scrubAndReplaceImages: async (block, client) => {
        const link = (await client.uploadImageString(block.data as string)).data.link;
        block.data = link;
        return [
            link,
        ];
    }
};