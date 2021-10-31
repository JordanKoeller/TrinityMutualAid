import React, {useContext, useMemo, useState} from 'react';

import { EditorState, } from 'draft-js';
import {
  Editor
} from 'react-draft-wysiwyg';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorClientContext } from '../context/context';

type WyswygProps = {};

export const Wyswyg: React.FC<WyswygProps> = () => {
  const context = useContext(EditorClientContext);
  const [state, setState] = useState<EditorState>(() => EditorState.createEmpty());

  const toolbarOptions = useMemo(() => ({
    image: {
      uploadEnabled: true,
      uploadCallback: (file: File) => {
        return context?.uploadImage(file);
      }
    },
    inline: { inDropdown: true },
    list: { inDropdown: true },
    textAlign: { inDropdown: true },
    link: { inDropdown: true },
    history: { inDropdown: true },
  }), [context]);



  return <Editor
      editorState={state}
      onEditorStateChange={setState}
      // toolbar={TOOLBAR_OPTIONS}
      toolbar={toolbarOptions}
      wrapperClassName="wyswyg-wrapper-class"
      editorClassName="wyswyg-editor-class"
      toolbarClassName="wyswyg-toolbar-class"
    />;
  
}

