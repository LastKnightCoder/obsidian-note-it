import * as React from 'react';
import Card from './Card';
import { Input } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';

export default function CardList(props) {
  const { notes: reveicedNotes = [], deleteNote, editNote, plugin } = props;

  const [searchValue, setSearchValue] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!searchValue) {
      setNotes(reveicedNotes.filter(note => !note.isDeleted));
      return;
    }
    setNotes(
      reveicedNotes
        .filter(note => !note.isDeleted)
        .filter(note => note?.tags?.some(tag => tag.indexOf(searchValue) !== -1))
    );
  }, [searchValue, reveicedNotes]);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  }


  return (
    <div className='note-it-classlist'>
      <div>
        <Input size='large' style={{ width: '100%', height: '40px' }} placeholder="输入要搜索的标签" onChange={handleChange} />
      </div>
      {notes.map(note => 
        <Card
          key={note.uuid}
          note={note}
          deleteNote={deleteNote}
          editNote={editNote}
          plugin={plugin}
        />
      )}
    </div>
  )
}