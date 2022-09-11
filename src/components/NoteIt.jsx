import * as React from 'react';
const { useState, useEffect }  = React;
import Editor from './Editor';
import CardList from './CardList';

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
        content: "",
        preview: ""
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
        content: "",
        preview: ""
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
    const newNotes = state.notes.map(note => {
      if (note.uuid === noteWillDelete.uuid) {
        return {
          ...noteWillDelete,
          isDeleted: 1
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
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', padding: '2em 5em' }}>
      <div style={{ marginTop: '2em' }}>
        <Editor editing={state.editing} onChange={handleEditorChange} onSave={handleEditorSave} />
      </div>
      <div style={{ height: 'calc(100vh - 270px)', boxSizing: 'border-box', overflow: 'auto' }}>
        <CardList notes={state.notes} deleteNote={handleDeleteNote} />
      </div>
    </div>
  )
}