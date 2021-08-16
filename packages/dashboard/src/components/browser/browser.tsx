import useWindow from '@/hooks/use-window';
import { useEffect, useRef, useState } from 'react';
import styles from './browser.module.css';

export default function Browser() {
  const closeApp = useWindow(state => state.closeApp);

  useEffect(() => {
    console.log('mounting');

    return () => {
      console.log('unmounting');
    };
  });

  return (
    <div
      // onClick={e => {
      //   closeApp();
      // }}
      className={styles.container}
    >
      <BrowserWindow />
    </div>
  );
}

function BrowserWindow() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('https://hailcore.co');
  const [isLoading, setLoading] = useState(false);
  const [html, setHtml] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/browser?url=${encodeURIComponent(url)}`)
      .then(r => r.text())
      .then(html => {
        setHtml(html);
        setLoading(false);
      });
  }, [url]);

  return (
    <>
      <div className={styles.formWrapper}>
        <form
          className={styles.form}
          onSubmit={e => {
            e.preventDefault();
            setUrl(inputRef.current?.value || 'https://hailcore.co');
          }}
        >
          <input
            defaultValue={url}
            placeholder="https://hailcore.co"
            ref={inputRef}
          />
        </form>
      </div>
      <div
        className={styles.iframeWrapper}
        style={{ backgroundColor: isLoading ? '#030303' : undefined }}
      >
        {isLoading ? (
          <div>
            <div className={styles.loader} />
          </div>
        ) : (
          <iframe width="100%" height="100%" srcDoc={html} />
        )}
      </div>
    </>
  );
}
