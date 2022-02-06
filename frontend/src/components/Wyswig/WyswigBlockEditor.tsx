

import React, {
    ReactElement,
    useCallback,
    useMemo,
    useRef,
} from 'react';
import { EditorState } from 'draft-js';
import Editor, { composeDecorators } from '@draft-js-plugins/editor';

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
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import '@draft-js-plugins/anchor/lib/plugin.css';
import '@draft-js-plugins/image/lib/plugin.css';
import '@draft-js-plugins/focus/lib/plugin.css';
import '@draft-js-plugins/alignment/lib/plugin.css';
import { ListGroup } from 'react-bootstrap';
import { ArticleDescription } from '../../utilities/types';
import { getBlockEditorComponent } from './Blocks/EditorBlockRegistry';
import { EditorBlock } from './Blocks/EditorBlock';
import { WyswigBlockSidebar } from './WyswigBlockSidebar';
import { EditorComponentAction } from './Blocks/useEditorBlocks';

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

const useEditorTools = () => {
    return useMemo(() => {
        const focusPlugin = createFocusPlugin();
        const resizeablePlugin = createResizeablePlugin();
        const alignmentPlugin = createAlignmentPlugin();

        const decorator = composeDecorators(
            resizeablePlugin.decorator,
            alignmentPlugin.decorator,
            focusPlugin.decorator,
        );
        const imagePlugin = createImagePlugin({ decorator });
        const linkPlugin = createLinkPlugin({
            Link: (props) => <a className="link" {...props}>{props.children}</a>
        });
        const inlineToolbarPlugin = createInlineToolbarPlugin();

        const plugins = {
            focusPlugin,
            imagePlugin,
            inlineToolbarPlugin,
            linkPlugin,
            alignmentPlugin,
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
    content?: EditorState,
    justify?: 'left' | 'center' | 'right'

};
export const WyswigBlockEditor: React.FC<WyswigProps> = ({ readonly = false, onChange, content, blockIndex, justify = "left" }): ReactElement => {


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
    return (
        <div
            className={`editor-${readonly ? 'readonly' : 'active'} ${blockIndex % 2 === 0 ? 'light' : 'dark'} ${justify}-justify`} onClick={focus}>
            <Editor
                textAlignment={justify}
                readOnly={readonly}
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
        </div>

    );
};


interface WyswigArticleProps {
    state: ArticleDescription,
    readOnly: boolean,
    onChange?: (state: EditorBlock, index: number) => void,
    Prefix?: ReactElement,
    Suffix?: ReactElement,
    dispatch?: React.Dispatch<EditorComponentAction>
}
export const WyswigArticle: React.FC<WyswigArticleProps> = ({ state, onChange, readOnly, Prefix, Suffix, dispatch }) => {
    return <ListGroup>
        {Prefix ? Prefix : null}
        {
            state.blocks.map((block, bI) => {
                const Component = getBlockEditorComponent(block.blockType);
                return <Component
                    Sidebar={dispatch && !readOnly ? <WyswigBlockSidebar dispatch={dispatch} blockIndex={bI} /> : null}
                    key={bI}
                    blockIndex={bI}
                    readOnly={readOnly}
                    state={block}
                    onChange={onChange}
                />
            }
            )
        }
        {Suffix ? Suffix : null}
    </ListGroup>
}


