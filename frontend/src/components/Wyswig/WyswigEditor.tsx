

import React, {
    ReactElement,
    useRef,
    useState,
} from 'react';
import { EditorState } from 'draft-js';
import Editor, { createEditorStateWithText, composeDecorators } from '@draft-js-plugins/editor';

import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
} from '@draft-js-plugins/buttons';

import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import createLinkPlugin from '@draft-js-plugins/anchor';
import createImagePlugin from '@draft-js-plugins/image';
import createAlignmentPlugin from '@draft-js-plugins/alignment';
import createFocusPlugin from '@draft-js-plugins/focus';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createDragNDropUploadPlugin from '@draft-js-plugins/drag-n-drop-upload';

import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import '@draft-js-plugins/side-toolbar/lib/plugin.css';
import '@draft-js-plugins/anchor/lib/plugin.css';
import '@draft-js-plugins/image/lib/plugin.css';
import '@draft-js-plugins/focus/lib/plugin.css';
import '@draft-js-plugins/alignment/lib/plugin.css';

const handleUpload = (data: any, success: any, failed: any, progress: any) => {
    console.log(data, success, failed, progress);
}

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
    resizeablePlugin.decorator,
    alignmentPlugin.decorator,
    focusPlugin.decorator,
    blockDndPlugin.decorator
    );
const imagePlugin = createImagePlugin({ decorator });
const handleAddImage =  (editorState: EditorState, placeholderSrc: string | ArrayBuffer | null) => {
    console.log("source", placeholderSrc);
    return (imagePlugin as any).addImage(editorState, placeholderSrc) as EditorState
}

const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
    handleUpload: handleUpload as () => void,
    addImage: handleAddImage, 
});

const linkPlugin = createLinkPlugin({
    Link: (props) => <a className="link" {...props}>{props.children}</a>
});
const inlineToolbarPlugin = createInlineToolbarPlugin();

const plugins = [
    dragNDropFileUploadPlugin,
    blockDndPlugin,
    focusPlugin,
    alignmentPlugin,
    resizeablePlugin,
    imagePlugin,
    inlineToolbarPlugin,
    linkPlugin
];




type WyswigProps = {};
export const WyswigEditor: React.FC<WyswigProps> = (): ReactElement => {

    const text = 'In this editor a toolbar shows up once you select part of the text …';
    const [editorState, setEditorState] = useState(createEditorStateWithText(text));

    // useEffect(() => {
    //     // fixing issue with SSR https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
    //     setEditorState(createEditorStateWithText(text));
    // }, []);

    const editor = useRef<Editor | null>(null);



    const focus = (): void => {
        editor.current?.focus();
    };

    return (
        <div className="editor" onClick={focus}>
            <Editor
                editorKey="SimpleInlineToolbarEditor"
                editorState={editorState}
                onChange={setEditorState}
                plugins={plugins}
                ref={(element) => {
                    editor.current = element;
                }}
            />
            <AlignmentTool />
            <inlineToolbarPlugin.InlineToolbar>
                {(externalProps) => (
                    <>
                        <BoldButton {...externalProps} />
                        <ItalicButton {...externalProps} />
                        <UnderlineButton {...externalProps} />
                        <linkPlugin.LinkButton {...externalProps} />
                    </>
                )}
            </inlineToolbarPlugin.InlineToolbar>
        </div>
    );
};


