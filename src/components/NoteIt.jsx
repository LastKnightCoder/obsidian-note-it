import * as React from 'react';
const { useState, useEffect }  = React;
import Editor from './Editor';
import CardList from './CardList';

export default function NoteIt(props) {
  const [state, setState] = useState(props.state);

  useEffect(() => {
    console.log('state', state);
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
        console.log('editing', editing);
        return editing;
      } else {
        return note;
      }
    });
    console.log('newNotes', newNotes);
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
    const newNotes = state.notes.map(note => {
      if (note.uuid === noteWillDelete.uuid) {
        return {
          ...noteWillDelete,
          isDeleted: true
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
    <div className='note-it-container'>
      <div className='note-it-editor-container'>
        <Editor editing={state.editing} onChange={handleEditorChange} onSave={handleEditorSave} />
      </div>
      <div className='note-it-preview-container'>
        <CardList notes={state.notes} deleteNote={handleDeleteNote} />
      </div>
    </div>
  )
}