import * as React from 'react';
import styles from './index.module.css';


export default function Card(props) {
  const { preview = '' } = props;

  return (
    <div className={styles.card}>
      <div dangerouslySetInnerHTML={{__html: preview}}></div>
    </div>
  )
}