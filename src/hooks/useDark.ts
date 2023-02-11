import * as React from 'react';
const { useState, useEffect } = React;

const useDark = () => {
  const [isDark, setIsDark] = useState(document.body.classList.contains('theme-dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('theme-dark'));
    })
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  });

  return isDark;
}

export default useDark;