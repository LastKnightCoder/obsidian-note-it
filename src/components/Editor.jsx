import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid'
import { Input, Button, Tabs, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { TabPane } = Tabs
const { TextArea } = Input;

import { renderMarkdown } from '../js/utils';
import { tagColors } from '../js/constants';

export default function Editor(props) {
  const { onChange, onSave, editing = {}, editorContentListener, minRows = 10, isNoteMode = true } = props;
  const { content = '', preview = '', tags = [] } = editing;

  const [value, setValue] = useState(content);
  const [markdownPreview, setMarkdownPreview] = useState(preview);

  const [noteTags, setNoteTags] = useState(tags);
  const [inputTagVisible, setInputTagVisible] = useState(false);
  const [inputTag, setInputTag] = useState('');
  const inputTagRef = useRef();

  const [activeKey, setActiveKey] = useState('edit');
  const [noteInfo, setNoteInfo] = useState(editing || {});
  const textareaRef = useRef();

  const handleEditNote = e => {
    const editNote = e.detail;
    setValue(editNote.content || '');
    setMarkdownPreview(editNote.preview || '');
    setNoteInfo({ ...editNote });
    setNoteTags(editNote.tags || []);
  }

  useEffect(() => {
    editorContentListener?.addEventListener('note-it-edit-note', handleEditNote);
    return () => {
      editorContentListener?.removeEventListener('note-it-edit-note', handleEditNote);
    }
  }, [handleEditNote]);

  useEffect(() => {
    onChange({
      ...noteInfo
    });
  }, [noteInfo]);

  useEffect(() => {
    if (inputTagVisible) {
      inputTagRef.current.focus();
    }
  }, [inputTagVisible]);

  useEffect(() => {
    if (activeKey === 'edit') {
      textareaRef.current.focus();
    }
  }, [activeKey]);

  const handleKeyUp = (e) => {
    if (!isNoteMode) return;
    if (e.ctrlKey && e.key === '/') {
      if (activeKey === 'edit') {
        setActiveKey('preview');
      } else {
        setActiveKey('edit');
      }
    }

    if (e.ctrlKey && e.key === 'Enter' && value) {
      handleSave();
    }
  }

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyUp])

  const handleChange = async e => {
    const content = e.target.value;
    setValue(content);
    // 下面这行语句放在 setValue 的下面和上面效果完全不一样
    // 放在上面会导致每次编辑时，文字跑到最后面
    // 并且输入中文字符会被输入两次，而放在下面则没事
    const preview = await renderMarkdown(content);
    setMarkdownPreview(preview);
    setNoteInfo({
      ...noteInfo,
      content,
      preview,
      createTime: noteInfo.createTime || Date.now(),
      updateTime: Date.now()
    });
  }

  const handleEditorKeyDown = async e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const position = e.target.selectionStart;
      const newValue = value.substring(0, position) + '  ' + value.substring(position);
      setValue(newValue);
      const preview = await renderMarkdown(content);
      setMarkdownPreview(preview);
      setNoteInfo({
        ...noteInfo,
        content,
        preview
      });
      e.target.selectionEnd = position + 2;
    }

    if (e.key === '`') {
      const startPosition = e.target.selectionStart;
      const endPosition = e.target.selectionEnd;
      if (
        startPosition === endPosition &&
        (
          value.substring(startPosition - 2, startPosition) === '``' ||
          value.substring(startPosition - 1, startPosition + 1) === '``'
        )
      ) {
        return;
      }
      e.preventDefault();
      const newContent = '`' + value.substring(startPosition, endPosition) + '`'
      const newValue = value.substring(0, startPosition) + newContent + value.substring(endPosition);
      setValue(newValue);
      const preview = await renderMarkdown(content);
      setMarkdownPreview(preview);
      setNoteInfo({
        ...noteInfo,
        content,
        preview
      });
      e.target.selectionEnd = endPosition + 1;
    }
  }

  const handleSave = () => {
    if (!value?.trim()) {
      return;
    }

    onSave({
      ...noteInfo,
      content: value,
      preview: markdownPreview,
      tags: noteTags,
      createTime: editing.createTime || Date.now(),
      updateTime: Date.now(),
      uuid: editing.uuid || uuid()
    });
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

  const handleInputTagChange = e => {
    setInputTag(e.target.value);
  }

  const handleInputConfirm = () => {
    if (inputTag && noteTags.indexOf(inputTag) === -1) {
      handleAddTag(inputTag);
    } else {
      if (inputTag) {
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
              ref={inputTagRef}
              style={{ width: '100%', height: '2.5em' }}
              value={inputTag}
              onChange={handleInputTagChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          )}
          {!inputTagVisible && (
            <Tag onClick={showInput} style={{ borderStyle: 'dashed', fontSize: '.8em', padding: '.1em .4em', cursor: 'pointer' }}>
              <PlusOutlined /> 新建标签
            </Tag>
          )}
        </div>
      </div>
    )
  }

  const renderSaveButton = () => {
    return (
      <div>
        <Button style={{ width: 'fit-content', marginRight: '.5em' }} onClick={handleSave} type='primary' disabled={!value}>小记一下</Button>
        {isNoteMode ? <span style={{ fontSize: '1em' }}>按 Ctrl + Enter 发送</span> : null}
      </div>
    )
  }

  return (
    <div className='note-it-editor' tabIndex={-1}>
      <Tabs activeKey={activeKey} type='line' onChange={handleTabChange}>
        <TabPane key="edit" tab="编辑">
          <div className='editor'>
            <TextArea 
              onKeyDown={handleEditorKeyDown} 
              placeholder={isNoteMode ? '使用快捷键 Ctrl + / 进行"编辑/预览"切换' : ''}
              ref={textareaRef} bordered={false} 
              value={value} autoSize={{ minRows }} 
              showCount onChange={handleChange} />
          </div>
        </TabPane>
        <TabPane key="preview" tab="预览">
          <div className='preview' style={{
            minHeight: '200px'
          }}>
            <div dangerouslySetInnerHTML={{ __html: markdownPreview }}></div>
          </div>
        </TabPane>
      </Tabs>
      {renderTags()}
      {renderSaveButton()}
    </div>
  )
}