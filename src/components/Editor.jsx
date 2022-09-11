import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuid } from 'uuid'
import { Input, Button, Tabs, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { TabPane } = Tabs
const { TextArea } = Input;

import { renderMarkdown } from '../js/utils';
import { tagColors } from '../js/constants';

export default function Editor(props) {
  const { onChange, onSave, editing } = props;
  const { content = '', preview = '', tags = [] } = editing;

  const [value, setValue] = useState(content);
  const [markdownPreview, setMarkdownPreview] = useState(preview);

  const [noteTags, setNoteTags] = useState(tags);
  const [inputTagVisible, setInputTagVisible] = useState(false);
  const [inputTag, setInputTag] = useState('');

  const [activeKey, setActiveKey] = useState('edit');
  const [noteInfo, setNoteInfo] = useState(editing || {});

  const handleEditNote = useCallback(e => {
    if (value) {
      // 先保存
      onSave({
        ...noteInfo,
        content: value,
        preview: markdownPreview,
        tags: noteTags,
        createTime: editing.createTime || Date.now(),
        updateTime: Date.now(),
        uuid: editing.uuid || uuid()
      })
    }

    const editNote = e.detail;
    setValue(editNote.content || '');
    setMarkdownPreview(editNote.preview || '');
    setNoteInfo({...editNote});
    setNoteTags(editNote.tags || []);
    onChange({
      ...editNote
    });
  }, [value]);

  useEffect(() => {
    window.addEventListener('note-it-edit-note', handleEditNote);

    return () => {
      window.removeEventListener('note-it-edit-note', handleEditNote);
    }
  }, [handleEditNote])

  const handleChange = async e => {
    const content = e.target.value;
    setValue(content);
    setMarkdownPreview(await renderMarkdown(content));
    onChange({
      ...noteInfo,
      content,
      preview: await renderMarkdown(content)
    })
  }

  const handleSave = () => {
    onSave({
      ...noteInfo,
      content: value,
      preview: markdownPreview,
      tags: noteTags,
      createTime: editing.createTime || Date.now(),
      updateTime: Date.now(),
      uuid: editing.uuid || uuid()
    })
    setValue('');
    setMarkdownPreview('');
    setNoteTags([]);
    setNoteInfo({});
  }

  const handleTabChange = (key) => {
    setActiveKey(key);
  }

  const handleCloseTag = (e, tag) => {
    e.preventDefault();
    const tags = noteTags.filter(noteTag => noteTag !== tag);
    setNoteTags(tags);
    onChange({
      ...noteInfo,
      tags
    })
  }

  const handleAddTag = (tag) => {
    const tags = [...noteTags, tag];
    setNoteTags(tags);
    onChange({
      ...noteInfo,
      tags
    });
    setInputTagVisible(false);
    setInputTag('');
  }

  const showInput = () => {
    setInputTagVisible(true);
  }

  const handleInputChange = e => {
    setInputTag(e.target.value);
  }

  const handleInputConfirm = () => {
    if (inputTag && noteTags.indexOf(inputTag) === -1) {
      handleAddTag(inputTag);
    } else {
      if(inputTag) {
        message.info('有同名的标签');
      } else {
        setInputTagVisible(false);
      }
    }
    
  }

  const renderTags = () => {
    return (
      <div className='note-it-tags-container'>
        <div className='note-it-tags'>
          {noteTags.map((tag, index) => {
            return <Tag color={tagColors[index % tagColors.length]} key={tag} closable onClose={(e) => handleCloseTag(e, tag)}>{tag}</Tag>
          })}
        </div>
        <div className='note-it-input-tag'>
          {inputTagVisible && (
            <Input
              bordered
              type="text"
              size="small"
              style={{ width: 128 }}
              value={inputTag}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          )}
          {!inputTagVisible && (
            <Tag onClick={showInput} style={{ borderStyle: 'dashed' }}>
              <PlusOutlined /> 新建标签
            </Tag>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='note-it-editor'>
      <Tabs defaultActiveKey={activeKey} type='line' onChange={handleTabChange}>
        <TabPane key="edit" tab="编辑">
          <div className='editor'>
            <TextArea bordered={false} value={value} autoSize={{ minRows: 20 }} showCount onChange={handleChange} />
          </div>
        </TabPane>
        <TabPane key="preview" tab="预览">
          <div className='preview'>
            <div dangerouslySetInnerHTML={{ __html: markdownPreview }}></div>
          </div>
        </TabPane>
      </Tabs>
      {renderTags()}
      {activeKey === 'edit' ? <Button style={{ width: 'fit-content' }} onClick={handleSave} type='primary' disabled={!value}>小记一下</Button> : null}
    </div>
  )
}