import * as React from 'react';
const { useState, useEffect, useRef } = React;
import { theme, ConfigProvider } from 'antd';
import Editor from './Editor';
import CardList from './CardList';

export default function NoteIt(props) {
  const [state, setState] = useState(props.state);
  const container = useRef();
  const [isDark, setIsDark] = useState(document.body.classList.contains('theme-dark'));

  useEffect(() => {
    const observer = new MutationObserver(mutations => {
      setIsDark(document.body.classList.contains('theme-dark'));
    })
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  });

  useEffect(() => {
    props.save(state);
  }, [state]);

  useEffect(() => {
    const width = parseFloat(window.getComputedStyle(container.current).width);
    if (width > Number(props.plugin.settings.widthToTwoColumn)) {
      container.current.classList.add('grid');
      container.current.classList.remove('flex');
    } else {
      container.current.classList.add('flex');
      container.current.classList.remove('grid');
    }
    const observer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const { contentRect } = entry;
        const { width } = contentRect;
        if (width > Number(props.plugin.settings.widthToTwoColumn)) {
          entry.target.classList.add('grid');
          entry.target.classList.remove('flex');
        } else {
          entry.target.classList.add('flex');
          entry.target.classList.remove('grid');
        }
      });
    });
    observer.observe(container.current);
    return () => {
      if (container.current) {
        observer.unobserve(container.current);
      }
    }
  }, [props.plugin.settings.widthToTwoColumn, container.current]);

  const handleEditorChange = editing => {
    const updatedState = {
      ...state,
      editing
    };

    setState(updatedState);
  }

  const handleEditorSave = editing => {
    const { isCreated = false } = editing;
    if (isCreated) {
      updateNote(editing)
    } else {
      createNote(editing)
    }
  }

  const updateNote = editing => {
    const newNotes = state?.notes.map(note => {
      if (note.uuid === editing.uuid) {
        return editing;
      } else {
        return note;
      }
    }) || [];
    setState({
      editing: {
        content: "",
        preview: "",
        tags: []
      },
      notes: [...newNotes]
    });
  }

  const createNote = editing => {
    const createdEditing = {
      ...editing,
      isCreated: true
    }

    setState({
      editing: {
        content: "",
        preview: "",
        tags: []
      },
      notes: Array.isArray(state.notes) ? [createdEditing, ...state.notes] : [createdEditing]
    })
  }

  // const handleEditNote = note => {
  //   setState({
  //     ...state,
  //     editing: note
  //   })
  // }

  const handleDeleteNote = noteWillDelete => {
    const newNotes = state.notes?.map(note => {
      if (note.uuid === noteWillDelete.uuid) {
        return {
          ...noteWillDelete,
          isDeleted: true
        }
      } else {
        return note;
      }
    }) || [];

    setState({
      ...state,
      notes: newNotes
    });
  }

  return (
    <ConfigProvider theme={{
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
    }}>
      <div className='note-it-container' ref={container}>
        <div className='note-it-editor-container'>
          <Editor editing={state.editing} onChange={handleEditorChange} onSave={handleEditorSave} />
        </div>
        <div className='note-it-preview-container'>
          <CardList notes={state.notes} deleteNote={handleDeleteNote} plugin={props.plugin} />
        </div>
      </div>
    </ConfigProvider>
  )
}