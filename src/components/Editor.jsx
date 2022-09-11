import * as React from 'react';
import { useState } from 'react';
import { v4 as uuid } from 'uuid'
import { Input, Button, Tabs } from 'antd';
const { TabPane } = Tabs
const { TextArea } = Input;

import { renderMarkdown } from '../js/utils';
import { useEffect } from 'react';
import { useCallback } from 'react';


export default function Editor(props) {
  const { onChange, onSave, editing } = props;
  const { content = '', preview = '' } = editing;
  const [value, setValue] = useState(content);
  const [markdownPreview, setMarkdownPreview] = useState(preview);
  const [activeKey, setActiveKey] = useState('edit');
  const [noteInfo, setNoteInfo] = useState(editing || {});

  const handleEditNote = useCallback(e => {
    if (value) {
      // 先保存
      onSave({
        ...noteInfo,
        content: value,
        preview: markdownPreview,
        createTime: editing.createTime || Date.now(),
        updateTime: Date.now(),
        uuid: editing.uuid || uuid()
      })
    }

    const editNote = e.detail;
    setValue(editNote.content || '');
    setMarkdownPreview(editNote.preview || '');
    setNoteInfo({...editNote})
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
      content: value,
      preview: markdownPreview
    })
  }

  const handleSave = () => {
    onSave({
      ...noteInfo,
      content: value,
      preview: markdownPreview,
      createTime: editing.createTime || Date.now(),
      updateTime: Date.now(),
      uuid: editing.uuid || uuid()
    })
    setValue('');
    setMarkdownPreview('');
    setNoteInfo({})
  }

  const handleTabChange = (key) => {
    setActiveKey(key);
  }

  return (
    <div className='note-it-editor'>
      <Tabs defaultActiveKey={activeKey} type='line' onChange={handleTabChange}>
        <TabPane key="edit" tab="编辑">
          <div className='editor'>
            <TextArea bordered={false} value={value} showCount autoSize={{ minRows: 30 }} onChange={handleChange} />
          </div>
        </TabPane>
        <TabPane key="preview" tab="预览">
          <div className='preview'>
            <div dangerouslySetInnerHTML={{ __html: markdownPreview }}></div>
          </div>
        </TabPane>
      </Tabs>
      {activeKey === 'edit' ? <Button style={{ width: 'fit-content' }} onClick={handleSave} type='primary' disabled={!value}>小记一下</Button> : null}
    </div>
  )
}