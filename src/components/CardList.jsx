import * as React from 'react';
import { useEffect } from 'react';
import Card from './Card';

export default function CardList(props) {
  const { notes, editNote, deleteNote } = props;

  if (!Array.isArray(notes)) {
    return null;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(30em, 1fr))', padding: '2em', gap: '5em', rowGap: '2em' }}>
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