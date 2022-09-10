import * as React from 'react';
import { useEffect } from 'react';


export default function Card(props) {
  const { preview = '' } = props;

  return (
    <div style={{ padding: '2em', boxShadow: '0 0 10px 0 rgba(0, 0, 0, .2)', userSelect: 'text' }}>
      <div dangerouslySetInnerHTML={{__html: preview}}></div>
    </div>
  )
}