import * as React from 'react';
const { useState, useEffect }  = React;
import Editor from './Editor';
import CardList from './CardList';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'
import 'antd/dist/antd.dark.css'
// import Test from './Test';

export default function NoteIt(props) {
  const [state, setState] = useState(props.state);

  useEffect(() => {
    props.save(state);
  }, [state]);

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
    const newNotes = state.notes.map(note => {
      if (note.uuid === editing.uuid) {
        return editing;
      } else {
        return note;
      }
    });
    setState({
      editing: {
        content: ""
      },
      notes: newNotes
    });
  }

  const createNote = editing => {
    const createdEditing = {
      ...editing,
      isCreated: true
    }

    setState({
      editing: {
        content: ""
      },
      notes: Array.isArray(state.notes) ? [...state.notes, createdEditing] : [createdEditing]
    })
  }

  const handleEditNote = note => {
    if (state.editing.content) {
      // 提示是否保存
      Modal.confirm({
        title: '编辑的内容未保存',
        icon: <ExclamationCircleOutlined />,
        content: '正在编辑的内容是否要保存',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          handleEditorSave(state.editing);
        }
      });
    }
    setState({
      ...state,
      editing: note
    })
  }

  const handleDeleteNote = noteWillDelete => {
    const newNotes = state.notes.map(note => {
      if (note.uuid === noteWillDelete.uuid) {
        return {
          ...noteWillDelete,
          is_deleted: 1
        }
      } else {
        return note;
      }
    })
    setState({
      ...state,
      notes: newNotes
    });
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '2em 5em' }}>
      <div style={{ height: 'calc(100vh - 300px)', boxShadow: '0 0 10px 0 rgba(0, 0, 0, .3)', marginTop: '2em', overflow: 'auto' }}>
        <Editor editing={state.editing} onChange={handleEditorChange} onSave={handleEditorSave} />
      </div>
      <div style={{ height: 'calc(100vh - 170px)', boxSizing: 'border-box', overflow: 'auto' }}>
        <CardList notes={state.notes} editNote={handleEditNote} deleteNote={handleDeleteNote} />
      </div>
    </div>
  )
}