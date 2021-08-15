import useWindow from '@/hooks/use-window';
import { useEffect, useRef, useState } from 'react';

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
      style={{
        backgroundColor: 'blue',
        height: '100%',
        width: '100%',
        padding: '1rem',
        borderRadius: 10,
      }}
    >
      <BrowserWindow />
    </div>
  );
}

function BrowserWindow() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!url) return;

    console.log('SEARCJ');
  }, [url]);

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          setUrl(inputRef.current?.value!);
        }}
      >
        <input ref={inputRef} />
        <button>Search</button>
      </form>
      <iframe width="100%" height="100%" src={url} />
    </div>
  );
}
