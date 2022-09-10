import * as React from 'react';
import { useEffect } from 'react';
import Card from './Card';

export default function CardList(props) {
  const { notes, editNote, deleteNote } = props;

  if (!Array.isArray(notes)) {
    return null;
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '2em', 
      gap: '2em', 
      height: '100%', 
      overflow: 'auto' 
    }}>
      {notes.map(note => 
        <Card
          key={note.uuid}
          {...note}
          editNote={() => { editNote(note) }}
          deleteNote={() => { deleteNote(note) }}
        />
      )}
    </div>
  )
}