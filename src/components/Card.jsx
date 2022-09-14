import * as React from 'react';
const { useState, useEffect, useRef } = React;
import { Tag, message, Modal, Select, Input } from 'antd';
const { Option } = Select;
import { tagColors } from '../js/constants';

export default function Card(props) {
  const { deleteNote, note, plugin } = props;
  const { isDeleted = false, preview = '', tags = [] } = note;

  const cardMaxHeight = Number(plugin.settings.cardMaxHeight) || 400;

  const [hasMore, setHasMore] = useState(true);
  const [hasMaxHeight, setHasMaxHeight] = useState(true);
  const cardRef = useRef();

  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [fileName, setFileName] = useState('');

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

  const handleCopyNote = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(note?.content || '');
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  }

  const handleTransferNote = async () => {
    const dirs = await plugin.getAllDirectory();
    setOptions(dirs)
    setTransferModalVisible(true);
    console.log(dirs);
  }

  const handleSelect = (option) => {
    setSelectedOption(option);
  }

  const handleFileNameInput = (e) => {
    setFileName(e.target.value);
  }

  const handleSubmit = () => {
    plugin.createOrAppend(selectedOption || '\\', (fileName || Date.now()) + '.md', note?.content || '');
    setTransferModalVisible(false);
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
            width: '100%',
            position: 'absolute',
            bottom: '.5em',
            left: 0,
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
    overflow: 'auto'
  } : {};

  return (
    <div style={{ position: 'relative' }}>
      <div ref={cardRef} className="note-it-card" style={cardStyle}>
        <div className='note-it-card-tags'>
          {tags?.map((tag, index) => {
            return <Tag color={tagColors[index % tagColors.length]} key={tag}>{tag}</Tag>
          })}
        </div>
        <div className='note-it-card-preview'>
          <div dangerouslySetInnerHTML={{__html: preview}}></div>
        </div>
        <div className='icons-wrapper'>
          <div className='icons'>
            <div className='copy' onClick={handleCopyNote}>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2377" width="16" height="16">
                <path d="M672 832 224 832c-52.928 0-96-43.072-96-96L128 160c0-52.928 43.072-96 96-96l448 0c52.928 0 96 43.072 96 96l0 576C768 788.928 724.928 832 672 832zM224 128C206.368 128 192 142.368 192 160l0 576c0 17.664 14.368 32 32 32l448 0c17.664 0 32-14.336 32-32L704 160c0-17.632-14.336-32-32-32L224 128z" p-id="2378"></path>
                <path d="M800 960 320 960c-17.664 0-32-14.304-32-32s14.336-32 32-32l480 0c17.664 0 32-14.336 32-32L832 256c0-17.664 14.304-32 32-32s32 14.336 32 32l0 608C896 916.928 852.928 960 800 960z" p-id="2379"></path>
                <path d="M544 320 288 320c-17.664 0-32-14.336-32-32s14.336-32 32-32l256 0c17.696 0 32 14.336 32 32S561.696 320 544 320z" p-id="2380"></path>
                <path d="M608 480 288.032 480c-17.664 0-32-14.336-32-32s14.336-32 32-32L608 416c17.696 0 32 14.336 32 32S625.696 480 608 480z" p-id="2381"></path>
                <path d="M608 640 288 640c-17.664 0-32-14.304-32-32s14.336-32 32-32l320 0c17.696 0 32 14.304 32 32S625.696 640 608 640z" p-id="2382"></path>
              </svg>
            </div>
            <div className='transfer' onClick={handleTransferNote}>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M726.411087 7.522772c10.030362 10.030362 10.030362 26.333732 0.419275 36.154456l-33.856504 33.856504h129.362646c110.543622 0 200.615307 90.063622 200.615307 200.615307V369.688189a25.688693 25.688693 0 0 1-25.704819 25.704819 25.688693 25.688693 0 0 1-25.704819-25.704819V278.149039c0-82.331213-67.084094-149.415307-149.415307-149.415307H692.76422l33.864567 33.848441a25.479055 25.479055 0 0 1 0 36.154457 25.454866 25.454866 0 0 1-18.19011 7.522772c-6.692283 0-13.166866-2.499528-18.182047-7.522772l-77.525669-77.525669a25.479055 25.479055 0 0 1 0-36.154457L690.25663 7.522772a25.479055 25.479055 0 0 1 36.154457 0z m-204.8 542.510362c0-13.997354 11.497827-25.495181 25.495181-25.704819h448.060472a25.688693 25.688693 0 0 1 25.696756 25.704819v447.842772a25.688693 25.688693 0 0 1-25.704819 25.704818H547.315906a25.688693 25.688693 0 0 1-25.704819-25.704818V550.033134z m51.2 25.704819v396.642771h396.433133V575.737953H572.811087zM0.628913 745.431685V653.900598a25.688693 25.688693 0 0 1 25.704819-25.704818 25.688693 25.688693 0 0 1 25.704819 25.704818v91.321449c0 82.339276 67.084094 149.42337 149.415307 149.42337H330.824567l-33.856504-33.864567a25.479055 25.479055 0 0 1 0-36.146393 25.479055 25.479055 0 0 1 36.154457 0l77.533732 77.533732c4.805543 4.805543 7.522772 11.288189 7.522772 18.173984 0 6.901921-2.717228 13.384567-7.522772 18.182047l-77.533732 77.533733a25.454866 25.454866 0 0 1-18.182048 7.522771c-6.692283 0-13.166866-2.499528-18.182047-7.522771a25.479055 25.479055 0 0 1 0-36.154457l33.856504-33.856504H201.24422c-110.543622 0-200.615307-90.063622-200.615307-200.615307zM476.055181 0c14.005417 0 25.495181 11.497827 25.704819 25.704819v447.842772a25.688693 25.688693 0 0 1-25.704819 25.704818H28.212409a25.688693 25.688693 0 0 1-25.704818-25.704818V25.704819A25.688693 25.688693 0 0 1 28.212409 0h447.842772z m-25.704819 447.842772h0.209638V51.2H53.917228v396.642772h396.433134z" fill="#707070" p-id="5093"></path>
              </svg>
            </div>
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
      </div>
      {renderLoad()}
      <Modal visible={transferModalVisible} onCancel={() => { setTransferModalVisible(false) }} onOk={handleSubmit}>
        <div style={{ margin: '1em' }}>
          文件夹：<Select style={{width: '350px' }} allowClear onSelect={handleSelect}>
            {options.map(option => {
              return <Option key={option} value={option}>{option.replace('\\', '/')}</Option>
            })}
          </Select>
        </div>
        <div>
          文件名称：<Input size='large' style={{ width: '350px' }} placeholder='请输入文件名称' onChange={handleFileNameInput} />
        </div>
      </Modal>
    </div>
    
  )
}

