import * as React from 'react';
const { useState, useEffect, useRef } = React;
import { theme, ConfigProvider } from 'antd';
import Editor from './Editor';
import CardList from './CardList';
import useDark from '../hooks/useDark';

export default function NoteIt(props) {
  const [state, setState] = useState(props.state);
  const container = useRef();
  const isDark = useDark();

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

  // 保存远内容，并更新为新内容
  const handleEditorSave = (editing, newEditing = {}) => {
    const { isCreated = false } = editing;
    if (isCreated) {
      updateNote(editing, newEditing);
    } else {
      createNote(editing, newEditing);
    }
    // 因为 Editor 不是受控组件，只能通过事件通知 Editor 修改编辑区内容
    const event = new CustomEvent('note-it-edit-note', { detail: newEditing });
    container.current.dispatchEvent(event);
  }

  const updateNote = (editing, newEditing = {}) => {
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
        tags: [],
        newEditing
      },
      notes: [...newNotes]
    });
  }

  const createNote = (editing, newEditing = {}) => {
    console.log('create', editing);
    if (!editing?.content?.trim()) {
      return;
    }
    const createdEditing = {
      ...editing,
      isCreated: true
    }

    setState({
      editing: {
        content: "",
        preview: "",
        tags: [],
        ...newEditing
      },
      notes: Array.isArray(state.notes) ? [createdEditing, ...state.notes] : [createdEditing]
    })
  }

  const handleEditNote = note => {
    // 先保存内容
    handleEditorSave(state.editing, note);
  }

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
          <Editor editing={state.editing} onChange={handleEditorChange} onSave={handleEditorSave} editorContentListener={container.current} />
        </div>
        <div className='note-it-preview-container'>
          <CardList notes={state.notes} deleteNote={handleDeleteNote} plugin={props.plugin} editNote={handleEditNote} />
        </div>
      </div>
    </ConfigProvider>
  )
}