

import React, {
    ReactElement,
    useContext,
    useMemo,
    useRef,
    useState,
} from 'react';
import { EditorState } from 'draft-js';
import Editor, { createEditorStateWithText, composeDecorators } from '@draft-js-plugins/editor';

import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    HeadlineOneButton,
    HeadlineTwoButton,
} from '@draft-js-plugins/buttons';

import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import createLinkPlugin from '@draft-js-plugins/anchor';
import createImagePlugin from '@draft-js-plugins/image';
import createAlignmentPlugin from '@draft-js-plugins/alignment';
import createFocusPlugin from '@draft-js-plugins/focus';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createDragNDropUploadPlugin from '@draft-js-plugins/drag-n-drop-upload';
import createSidebarToolPlugin from '@draft-js-plugins/side-toolbar';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import '@draft-js-plugins/side-toolbar/lib/plugin.css';
import '@draft-js-plugins/anchor/lib/plugin.css';
import '@draft-js-plugins/image/lib/plugin.css';
import '@draft-js-plugins/focus/lib/plugin.css';
import '@draft-js-plugins/alignment/lib/plugin.css';
import { EditorClientContext } from '../../context/context';
import { dataUrlToFile } from '../../utilities/funcs';
import EditorClient from '../../context/client';
import { WyswigLanguageSelector } from './WyswigLanguageSelector';

const handleUpload = (data: any, success: any, failed: any, progress: any) => {
    // console.log(data, success, failed, progress);
}


const useEditorTools = (context: EditorClient) => {
    return useMemo(() => {
        const focusPlugin = createFocusPlugin();
        const resizeablePlugin = createResizeablePlugin();
        const blockDndPlugin = createBlockDndPlugin();
        const alignmentPlugin = createAlignmentPlugin();
        const sidebarPlugin = createSidebarToolPlugin();
        const handleAddImage = (editorState: EditorState, placeholderSrc: string | ArrayBuffer | null) => {
            const uploadedFile = dataUrlToFile(placeholderSrc as string, "file-upload");
            context.uploadImage(uploadedFile);
            return (imagePlugin as any).addImage(editorState, placeholderSrc) as EditorState
        }

        const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
            handleUpload: handleUpload as () => void,
            addImage: handleAddImage,
        });
        const decorator = composeDecorators(
            resizeablePlugin.decorator,
            alignmentPlugin.decorator,
            focusPlugin.decorator,
            blockDndPlugin.decorator
        );
        const imagePlugin = createImagePlugin({ decorator });
        const linkPlugin = createLinkPlugin({
            Link: (props) => <a className="link" {...props}>{props.children}</a>
        });
        const inlineToolbarPlugin = createInlineToolbarPlugin();

        const plugins = {
            dragNDropFileUploadPlugin,
            blockDndPlugin,
            focusPlugin,
            alignmentPlugin,
            resizeablePlugin,
            imagePlugin,
            inlineToolbarPlugin,
            linkPlugin,
            sidebarPlugin
        };
        return {
            pluginsObj: plugins,
            pluginsArray: Object.values(plugins)
        };
    }, []);
}




type WyswigProps = {};
export const WyswigEditor: React.FC<WyswigProps> = (): ReactElement => {


    const context = useContext(EditorClientContext);
    const { pluginsObj, pluginsArray } = useEditorTools(context);

    // Initialize editor statefulness
    const enText = 'In this editor a toolbar shows up once you select part of the text …';
    const esText = 'En este editor, aparece una barra de herramientas una vez que selecciona parte del texto ...';
    const englishState = useState(createEditorStateWithText(enText));
    const spanishState = useState(createEditorStateWithText(esText));
    const [language, setLanguage] = useState('en');

    const [editorState, setEditorState] = language === 'en' ? englishState : spanishState;



    // useEffect(() => {
    //     // fixing issue with SSR https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
    //     setEditorState(createEditorStateWithText(text));
    // }, []);

    const editor = useRef<Editor | null>(null);



    const focus = (): void => {
        editor.current?.focus();
    };

    return (
        <div>
            <WyswigLanguageSelector onLanguageChange={setLanguage} style={{marginLeft: 'auto', marginRight: '0'}}/>
            <div className="editor" onClick={focus}>
                <Editor
                    editorKey="SimpleInlineToolbarEditor"
                    editorState={editorState}
                    onChange={setEditorState}
                    plugins={pluginsArray}
                    ref={(element) => {
                        editor.current = element;
                    }}
                />
                <pluginsObj.alignmentPlugin.AlignmentTool />
                <pluginsObj.inlineToolbarPlugin.InlineToolbar>
                    {(externalProps) => (
                        <>
                            <HeadlineOneButton {...externalProps} />
                            <HeadlineTwoButton {...externalProps} />
                            <BoldButton {...externalProps} />
                            <ItalicButton {...externalProps} />
                            <UnderlineButton {...externalProps} />
                            <pluginsObj.linkPlugin.LinkButton {...externalProps} />

                        </>
                    )}
                </pluginsObj.inlineToolbarPlugin.InlineToolbar>
                <pluginsObj.sidebarPlugin.SideToolbar />
            </div>
        </div>
    );
};


