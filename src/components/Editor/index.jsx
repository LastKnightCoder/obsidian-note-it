import * as React from 'react';
import { useState } from 'react';
import { v4 as uuid } from 'uuid'
import { Input, Button, Tabs } from 'antd';
const { TabPane } = Tabs
const { TextArea } = Input;
import styles from './index.module.css';

import { renderMarkdown } from '../../js/utils';


export default function Editor(props) {
  const { onChange, onSave, editing } = props;
  const { content = '', preview = '' } = editing;
  const [value, setValue] = useState(content);
  const [markdownPreview, setMarkdownPreview] = useState(preview)

  const handleChange = async e => {
    const content = e.target.value;
    setValue(content);
    setMarkdownPreview(await renderMarkdown(content));
    onChange({
      ...editing,
      content: value,
      preview: markdownPreview
    })
  }

  const handleSave = () => {
    onSave({
      ...editing,
      content: value,
      preview: markdownPreview,
      createTime: editing.createTime || Date.now(),
      updateTime: Date.now(),
      uuid: editing.uuid || uuid()
    })
    setValue('')
    setMarkdownPreview('')
  }

  return (
    <div className={styles.noteItEditor}>
      <Tabs defaultActiveKey='edit' type='line'>
        <TabPane key="edit" tab="编辑">
          <TextArea bordered={false} value={value} showCount autoSize={{ minRows: 6 }} onChange={handleChange} />
        </TabPane>
        <TabPane key="preview" tab="预览">
          <div className={styles.preview}>
            <div dangerouslySetInnerHTML={{ __html: markdownPreview }}></div>
          </div>
        </TabPane>
      </Tabs>
      <Button style={{ width: 'fit-content' }} onClick={handleSave} type='primary' disabled={!value}>小记一下</Button>
    </div>
  )
}