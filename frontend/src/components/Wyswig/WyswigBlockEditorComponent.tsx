

import React, {
    ReactElement,
    useCallback,
    useMemo,
    useRef,
} from 'react';
import { convertToRaw, convertFromRaw, EditorState, RawDraftContentState, DefaultDraftBlockRenderMap } from 'draft-js';
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
import { Container, ListGroup } from 'react-bootstrap';
import { ArticleDescription } from '../../utilities/types';

const inlineStyles = {

    // 'LINK': {},
    // 'BOLD': {},
    // 'ITALICS': {},
    // 'UNDERLINE': {},
    // 'H1': {},
    // 'H2': {}
}

const blockStyles: Record<string, string> = {
    'header-one': "jumbotron-title",
    'header-two': "jumbotron-subtitle",
}

const DarkJumbotron = () => {
    return <div className="jumbotron-dark" />;
}

const extraBlocks: Record<string, any> = {
    'header-two': {
        'element': 'header-one',
        'wrapper': <DarkJumbotron />
    }
}

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
            handleUpload: () => { },
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
    blockIndex: number,
    onChange?: (draft: EditorState, blockIndex: number) => void,
    readonly?: boolean,
    content?: EditorState

};
export const WyswigBlockEditor: React.FC<WyswigProps> = ({ readonly = false, onChange, content, blockIndex }): ReactElement => {


    const { pluginsObj, pluginsArray } = useEditorTools();

    // useEffect(() => {
    //     // fixing issue with SSR https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
    //     setEditorState(createEditorStateWithText(text));
    // }, []);

    const editor = useRef<Editor | null>(null);

    const focus = (): void => {
        editor.current?.focus();
    };

    const change = useCallback((state: EditorState) => onChange ? onChange(state, blockIndex) : null, [blockIndex, onChange]);

    // const handleSave = () => {
    //     const contents = editorState.getCurrentContent();
    //     const rawContents = convertToRaw(contents);
    //     const title = "TODO";
    //     if (onSave) {
    //         onSave(rawContents, title, language);
    //     }
    // }

    // const handleCancelInput = () => {
    //     setEditorState(initializeState(language));
    // }

    return (
        <div>
            <div className={`editor-${readonly ? 'readonly' : 'active'}`} onClick={focus}>
                <Container fluid="lg">
                    <Editor
                        editorKey="SimpleInlineToolbarEditor"
                        editorState={content}
                        customStyleMap={inlineStyles}
                        blockStyleFn={contentBlock => blockStyles[contentBlock.getType()]}
                        onChange={change}
                        plugins={pluginsArray}
                        ref={(element) => {
                            editor.current = element;
                        }}
                    />
                </Container>
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


interface WyswigArticleProps {
    state: ArticleDescription,
    readOnly: boolean,
    onChange?: (state: EditorState, index: number) => void,
    Prefix?: ReactElement,
    Suffix?: ReactElement
}
export const WyswigArticle: React.FC<WyswigArticleProps> = ({ state, onChange, readOnly, Prefix, Suffix }) => {
    return <ListGroup>
        {Prefix ? Prefix : null}
        {
            state.blocks.map((block, bI) =>
                <WyswigBlockEditor
                    readonly={readOnly}
                    blockIndex={bI}
                    content={block.editorState}
                    onChange={onChange}
                />
            )
        }
        {Suffix ? Suffix: null}
    </ListGroup>
}


