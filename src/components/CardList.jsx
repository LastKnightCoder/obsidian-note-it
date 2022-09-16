import * as React from 'react';
import Card from './Card';

export default function CardList(props) {
  const { notes = [], deleteNote, plugin } = props;

  return (
    <div className='note-it-classlist'>
      {notes.filter(note => !note.isDeleted).map(note => 
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