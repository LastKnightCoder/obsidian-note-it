import * as React from 'react';
const { useState, useEffect, useRef } = React;
import { Tag } from 'antd';
import { tagColors } from '../js/constants';

export default function Card(props) {
  const { deleteNote, note, plugin } = props;
  const { isDeleted = false, preview = '', tags = [] } = note;

  const cardMaxHeight = Number(plugin.settings.cardMaxHeight) || 400;

  const [hasMore, setHasMore] = useState(true);
  const [hasMaxHeight, setHasMaxHeight] = useState(true);
  const cardRef = useRef()

  useEffect(() => {
    if (cardRef.current && cardRef.current.scrollHeight < cardMaxHeight) {
      setHasMore(false);
      setHasMaxHeight(false);
    }
  }, []);

  const handleEditNote = () => {
    const event = new CustomEvent('note-it-edit-note', {
      detail: note
    });
    window.dispatchEvent(event);
  }

  const handleDeleteNote = () => {
    deleteNote(note);
  }

  if (isDeleted) {
    return null;
  }

  const renderLoad = () => {
    if (!hasMore) {
      return null;
    }

    if (hasMaxHeight) {
      return (
        <div 
          onClick={() => { setHasMaxHeight(false) }} 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            cursor: 'pointer', 
            padding: '10px 0',
            position: 'absolute',
            bottom: '.5em',
            left: 0,
            width: '100%'
          }}>
          <svg style={{transform: 'rotate(90deg)', transformOrigin: 'center', }} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
            <path d="M568.96 853.76c-8.32 0-16.64-3.2-22.4-9.6-12.8-12.8-12.8-32.64 0-45.44l213.12-213.12c10.88-10.88 16.64-25.6 16.64-40.96s-5.76-30.08-16.64-40.96L546.56 291.84c-12.8-12.8-12.8-32.64 0-45.44s32.64-12.8 45.44 0l213.12 213.12c23.04 23.04 35.84 53.76 35.84 86.4s-12.8 63.36-35.84 86.4l-213.12 213.12c-6.4 5.12-14.72 8.32-23.04 8.32z" fill="#515151" p-id="19812"></path>
            <path d="M293.12 853.76c-8.32 0-16.64-3.2-22.4-9.6-12.8-12.8-12.8-32.64 0-45.44l213.12-213.12c22.4-22.4 22.4-59.52 0-81.92L270.72 291.84c-12.8-12.8-12.8-32.64 0-45.44s32.64-12.8 45.44 0l213.12 213.12c47.36 47.36 47.36 124.8 0 172.16L316.16 844.8c-6.4 5.76-14.72 8.96-23.04 8.96z" fill="#515151" p-id="19813"></path>
          </svg>
        </div>
      )
    } else {
      return (
        <div 
          onClick={() => { setHasMaxHeight(true) }} 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            cursor: 'pointer', 
            padding: '10px 0',
            width: '100%'
          }}>
          <svg style={{transform: 'rotate(-90deg)', transformOrigin: 'center', }} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
            <path d="M568.96 853.76c-8.32 0-16.64-3.2-22.4-9.6-12.8-12.8-12.8-32.64 0-45.44l213.12-213.12c10.88-10.88 16.64-25.6 16.64-40.96s-5.76-30.08-16.64-40.96L546.56 291.84c-12.8-12.8-12.8-32.64 0-45.44s32.64-12.8 45.44 0l213.12 213.12c23.04 23.04 35.84 53.76 35.84 86.4s-12.8 63.36-35.84 86.4l-213.12 213.12c-6.4 5.12-14.72 8.32-23.04 8.32z" fill="#515151" p-id="19812"></path>
            <path d="M293.12 853.76c-8.32 0-16.64-3.2-22.4-9.6-12.8-12.8-12.8-32.64 0-45.44l213.12-213.12c22.4-22.4 22.4-59.52 0-81.92L270.72 291.84c-12.8-12.8-12.8-32.64 0-45.44s32.64-12.8 45.44 0l213.12 213.12c47.36 47.36 47.36 124.8 0 172.16L316.16 844.8c-6.4 5.76-14.72 8.96-23.04 8.96z" fill="#515151" p-id="19813"></path>
          </svg>
        </div>
      )
    }
  }

  const cardStyle = hasMaxHeight ? {
    maxHeight: `${cardMaxHeight}px`,
    overflow: 'hidden'
  } : {};

  return (
    <div ref={cardRef} className="note-it-card" style={cardStyle}>
      <div className='note-it-card-tags'>
        {tags?.map((tag, index) => {
          return <Tag color={tagColors[index % tagColors.length]} key={tag}>{tag}</Tag>
        })}
      </div>
      <div dangerouslySetInnerHTML={{__html: preview}}></div>
      <div className='icons-wrapper'>
        <div className='icons'>
          <div className='edit' onClick={handleEditNote}>
            <svg width="16" height="16" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M652.4 156.6125a112.5 112.5 0 1 1 155.925 161.15625L731.375 394.71875 572.3 235.5875l79.5375-79.5375 0.5625 0.5625zM333.63125 792.40625v0.1125H174.5v-159.1875l358.03125-357.975 159.075 159.13125-357.975 357.91875zM62 849.5h900v112.5H62v-112.5z" 
                fill="#262626"
              >
              </path>
            </svg>
          </div>
          <div className='delete' onClick={handleDeleteNote}>
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <path d="M608 768c-17.696 0-32-14.304-32-32L576 384c0-17.696 14.304-32 32-32s32 14.304 32 32l0 352C640 753.696 625.696 768 608 768z"></path>
              <path d="M416 768c-17.696 0-32-14.304-32-32L384 384c0-17.696 14.304-32 32-32s32 14.304 32 32l0 352C448 753.696 433.696 768 416 768z"></path>\
              <path d="M928 224l-160 0L768 160c0-52.928-42.72-96-95.264-96L352 64C299.072 64 256 107.072 256 160l0 64L96 224C78.304 224 64 238.304 64 256s14.304 32 32 32l832 0c17.696 0 32-14.304 32-32S945.696 224 928 224zM320 160c0-17.632 14.368-32 32-32l320.736 0C690.272 128 704 142.048 704 160l0 64L320 224 320 160z"></path>
              <path d="M736.128 960 288.064 960c-52.928 0-96-43.072-96-96L192.064 383.52c0-17.664 14.336-32 32-32s32 14.336 32 32L256.064 864c0 17.664 14.368 32 32 32l448.064 0c17.664 0 32-14.336 32-32L768.128 384.832c0-17.664 14.304-32 32-32s32 14.336 32 32L832.128 864C832.128 916.928 789.056 960 736.128 960z"></path>
            </svg>
          </div>
        </div>
      </div>
      {renderLoad()}
    </div>
  )
}