import useWindow, { AppType } from '@/hooks/use-window';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import Browser from '../browser/browser';
import Spotify from '../spotify/spotify';
import styles from './window.module.css';

export default function Window() {
  const { isOpen, closeApp, app } = useWindow();
  const App = Apps[app];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
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
          key={app}
          // layoutId="app"
          className={styles.appWrapper}
          transition={{ duration: 1, type: 'spring' }}
        >
          <App />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const Apps = {
  [AppType.SPOTIFY]: Spotify,
  [AppType.BROWSER]: Browser,
};

// function App() {
//   const app = useWindow(state => state.app);

//   switch (app) {
//     case Apps.SPOTIFY: {
//       return (
//         <div
//           style={{ backgroundColor: 'white', height: '100%', width: '100%' }}
//         >
//           Spotify
//         </div>
//       );
//     }
//   }
// }
