import Editor from "./Editor";
import * as React from 'react';
import { theme, ConfigProvider, Modal, Input, message } from 'antd';
import useDark from "../hooks/useDark";

const { useState, useRef } = React;

const ZKEditor = (props) => {
  const { note = {}, saveToLocalStorage, saveToFile } = props;
  const [fileName, setFileName] = useState('');
  const [editing, setEditing] = useState(note);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const inputRef = useRef();
  const container = useRef();
  const isDark = useDark();
  
  const handleChange = (editing) => {
    setEditing(editing);
    saveToLocalStorage(editing);
  }

  const handleSave = () => {
    setIsModalVisible(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const handleSaveToFile = () => {
    if (fileName.trim() === '' || !editing.content) {
      setIsModalVisible(false);
      return;
    };
    const { tags, updateTime, createTime } = editing;
    const fronnterMatter = `---
title: ${fileName}
created: ${new Date(createTime).toLocaleString()}
updated: ${new Date(updateTime).toLocaleString()}
tags: [${tags?.join(', ')}]
---\n\n`;

    try {
      saveToFile(fileName, fronnterMatter + editing.content);
    } catch(e) {
      message.error('保存失败，请确定文件夹是否存在');
      setFileName("");
      return;
    }
    setIsModalVisible(false);
    setFileName("");
    message.success('保存成功');
    setEditing({});
    saveToLocalStorage({});
    const event = new CustomEvent('note-it-edit-note', { detail: {} });
    container.current?.dispatchEvent(event);
  }

  return (
    <ConfigProvider theme={{
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
    }}>
      <div ref={container} className='zk-editor-container' style={{
        padding: '1em 1em',
        width: '100%',
        background: 'transparent'
      }}>
        <Editor editing={editing} onChange={handleChange} onSave={handleSave} editorContentListener={container.current} minRows={15} isNoteMode={false} />
      </div>
      <Modal okText="保存" cancelText="取消" open={isModalVisible} onCancel={() => { setIsModalVisible(false); setFileName(""); }} onOk={handleSaveToFile}>
        <Input 
          value={fileName}
          ref={inputRef}
          onChange={(e) => { setFileName(e.target.value) }} 
          placeholder="请输入要保存的文件名，回车确定" 
          onPressEnter={handleSaveToFile} 
          style={{ marginTop: '3em', marginBottom: '1em', height: '3em' }} />
      </Modal>
    </ConfigProvider>
  )
}

export default ZKEditor;
