import * as React from 'react';
import Card from './Card';

export default function CardList(props) {
  const { notes, deleteNote, plugin } = props;

  if (!Array.isArray(notes)) {
    return null;
  }

  return (
    <div className='note-it-classlist'>
      {notes.map(note => 
        <Card
          key={note.uuid}
          note={note}
          deleteNote={deleteNote}
          plugin={plugin}
        />
      )}
    </div>
  )
}