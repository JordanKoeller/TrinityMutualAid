

import React, {
    ReactElement,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { convertToRaw, convertFromRaw, EditorState, RawDraftContentState } from 'draft-js';
import Editor, { createEditorStateWithText, composeDecorators } from '@draft-js-plugins/editor';

import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    OrderedListButton,
    UnorderedListButton
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
import { WyswigControlButtons } from './WyswigLanguageSelector';
import { Language } from '../../i18n';
import { useBilingual } from '../../utilities/hooks';



const useEditorTools = () => {
    return useMemo(() => {
        const focusPlugin = createFocusPlugin();
        const resizeablePlugin = createResizeablePlugin();
        const blockDndPlugin = createBlockDndPlugin();
        const alignmentPlugin = createAlignmentPlugin();
        const sidebarPlugin = createSidebarToolPlugin();
        const handleAddImage = (editorState: EditorState, placeholderSrc: string | ArrayBuffer | null) => {
            return (imagePlugin as any).addImage(editorState, placeholderSrc) as EditorState
        }

        const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
            handleUpload: () => {},
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




type WyswigProps = {
    defaultLanguage: Language,
    onSave?: (draft: RawDraftContentState, title: string, language: Language) => Promise<boolean>,
    readonly?: boolean,
    content?: RawDraftContentState

};
export const WyswigEditor: React.FC<WyswigProps> = ({ readonly = false, defaultLanguage, onSave, content }): ReactElement => {


    const { pluginsObj, pluginsArray } = useEditorTools();

    const initializeState = (lang: Language): EditorState => {
        // Initialize editor statefulness
        const defaultStates = {
            [Language.English]: 'Enter text here',
            [Language.Spanish]: 'Introducir texto aquí',
        };
        if (lang === defaultLanguage && content) {
            const contentObj = convertFromRaw(content);
            return EditorState.createWithContent(contentObj);
        }
        return createEditorStateWithText(defaultStates[defaultLanguage]);
    }
    const [editorState, language, setEditorState, setLanguage, refreshState] = useBilingual(
        defaultLanguage, {[Language.English]: initializeState(Language.English), [Language.Spanish]: initializeState(Language.Spanish)});

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
    };

    // useEffect(() => {
    //     if (content) {
    //         const contentObj = convertFromRaw(content);
    //         const state = EditorState.createWithContent(contentObj);
    //         refreshState(defaultLanguage, state);
    //     } else {
    //         const defaultStates = {
    //             [Language.English]: 'Enter text here',
    //             [Language.Spanish]: 'Introducir texto aquí',
    //         };
    //         const state = createEditorStateWithText(defaultStates[defaultLanguage]);

    //         refreshState(defaultLanguage, state)
    //     }
    // }, [defaultLanguage, content, refreshState]);

    // useEffect(() => {
    //     // fixing issue with SSR https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
    //     setEditorState(createEditorStateWithText(text));
    // }, []);

    const editor = useRef<Editor | null>(null);

    const focus = (): void => {
        editor.current?.focus();
    };

    const handleSave = () => {
        const contents = editorState.getCurrentContent();
        const rawContents = convertToRaw(contents);
        const title = "TODO";
        if (onSave) {
            onSave(rawContents, title, language);
        }
    }

    const handleCancelInput = () => {
        setEditorState(initializeState(language));
    }

    return (
        <div>
            {readonly ? null : <WyswigControlButtons
                onLanguageChange={changeLanguage}
                defaultLanguage={defaultLanguage}
                style={{ marginLeft: 'auto', marginRight: '0' }}
                onSave={handleSave}
                onCancel={handleCancelInput}
            />}
            <div className={`editor-${readonly ? 'readonly' : 'active'}`} onClick={focus}>
                <Editor
                    readOnly={readonly}
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
                    {(externalProps) => <>
                        <HeadlineOneButton {...externalProps} />
                        <HeadlineTwoButton {...externalProps} />
                        <BoldButton {...externalProps} />
                        <ItalicButton {...externalProps} />
                        <UnderlineButton {...externalProps} />
                        <OrderedListButton {...externalProps} />
                        <UnorderedListButton {...externalProps} />
                        <pluginsObj.linkPlugin.LinkButton {...externalProps} />
                    </>
                    }
                </pluginsObj.inlineToolbarPlugin.InlineToolbar>
                {readonly ? null : <pluginsObj.sidebarPlugin.SideToolbar />}
            </div>
        </div>
    );
};


