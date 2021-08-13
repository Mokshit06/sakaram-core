import useWindow, { Apps } from '@/hooks/use-window';
import { AnimatePresence, motion } from 'framer-motion';
import { RefObject, useState } from 'react';
import styles from './window.module.css';

export default function Window(props: {
  containerRef: RefObject<HTMLDivElement>;
}) {
  const { isOpen, closeApp } = useWindow();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={() => closeApp()}
          variants={{
            hidden: {
              y: '100vh',
            },
            visible: {
              y: '0vh',
              transition: { duration: 1, type: 'spring' },
            },
          }}
          initial="hidden"
          exit="hidden"
          animate="visible"
          className={styles.appWrapper}
          transition={{ duration: 1, type: 'spring' }}
        >
          {/* <div
            style={{ backgroundColor: 'white', height: '100%', width: '100%' }}
          ></div> */}
          <App />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  const { app } = useWindow();

  switch (app) {
    case Apps.SPOTIFY: {
      return (
        <div
          style={{ backgroundColor: 'white', height: '100%', width: '100%' }}
        >
          Spotify
        </div>
      );
    }
  }
}
