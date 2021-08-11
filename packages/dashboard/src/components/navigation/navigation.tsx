import { useEffect, useRef } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import styles from './navigation.module.css';

export default function Navigation() {
  const { listening } = useSpeechRecognition();
  const iconRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (listening) {
      const animation = iconRef.current?.animate(
        {
          transform: 'rotate(360deg)',
        },
        {
          duration: 3000,
          fill: 'forwards',
          iterations: Infinity,
        }
      );

      // animation?.finished.then(() => {
      //   if (iconRef.current) {
      //     iconRef.current.style.transform = 'rotate(360deg)';
      //   }
      // });

      return () => {
        animation?.cancel();
      };
    }
  }, [listening]);

  return (
    <div className={styles.nav}>
      <div className={styles.icons}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`${styles.voice}`}
          ref={iconRef}
          onClick={() =>
            listening
              ? SpeechRecognition.stopListening()
              : SpeechRecognition.startListening()
          }
          src="/voice-icon.png"
          height={60}
          width={60}
          alt=""
        />
        <h1>A</h1>
        <h1>A</h1>
        <h1>A</h1>
        <h1>A</h1>
        <h1>A</h1>
      </div>
    </div>
  );
}
