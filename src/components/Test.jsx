import * as React from 'react';
import { Tabs } from 'antd';

export default function Demo() {
  return (
    <Tabs defaultActiveKey='1'>
      <Tabs.TabPane key="1" tab="HTML">
        HTML
      </Tabs.TabPane>
      <Tabs.TabPane key="2" tab="CSS">
        CSS
      </Tabs.TabPane>
    </Tabs>
  )
}