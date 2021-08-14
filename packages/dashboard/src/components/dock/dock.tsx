import useDirections from '@/hooks/use-directions';
import useMusic from '@/hooks/use-music';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { RefObject, useCallback, useRef } from 'react';
import styles from './dock.module.css';

type DockProps = {
  containerRef: RefObject<HTMLDivElement>;
};

export default function Dock({ containerRef }: DockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  // calc the position of dock
  // and snap it to the nearest corner
  const modifyTarget = useCallback(
    (target: number) => {
      const containerRect = containerRef.current!.getBoundingClientRect();
      const dockRect = dockRef.current!.getBoundingClientRect();
      const dockMiddleX = dockRect.width / 2;
      const dockMiddleY = dockRect.height / 2;

      if (target + dockMiddleX > containerRect.width / 2) {
        return containerRect.width;
      } else if (target + dockMiddleY > containerRect.height / 2) {
        return containerRect.height;
      }

      return 0;
    },
    [containerRef]
  );

  return (
    <motion.div
      className={styles.dockContainer}
      layoutId="box"
      initial={false}
      dragTransition={{
        modifyTarget,
        power: 0,
        min: 0,
        max: 200,
        timeConstant: 250,
      }}
      transition={{
        type: 'spring',
        stiffness: 50,
      }}
      ref={dockRef}
      // animate={}
      drag
      dragConstraints={containerRef}
      dragElastic={1}
      layout
    >
      <div className={styles.dock}>
        <MusicWidget />
        <Directions />
      </div>
    </motion.div>
  );
}

function Directions() {
  const directions = useDirections(state => state.directions);

  return (
    <ul style={{ overflow: 'hidden' }}>
      <AnimatePresence>
        {directions.map((direction, index) => {
          return (
            <motion.li
              key={`${direction.instruction}-${index}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0, transition: { delay: index / 20 } }}
              exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
            >
              <Direction modifier={direction.modifier}>
                {direction.instruction}
              </Direction>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}

function Direction({
  modifier,
  children,
}: {
  modifier: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={getDirectionIcon(modifier)} alt="" />
      <span>{children}</span>
    </div>
  );
}

function MusicWidget() {
  const {
    currentTrackIndex,
    tracks,
    nextTrack,
    previousTrack,
    isPlaying,
    togglePlaying,
  } = useMusic();
  const currentTrack = useMemo(
    () => tracks[currentTrackIndex],
    [currentTrackIndex, tracks]
  );
  // react didn't hydrate image on the client due to some reason
  // which caused the image of the first track to show on initial render
  // even though the `currentTrackIndex` from localStorage was different
  // whenever `currentTrack` changes, this will rerender the component
  // forcing react to update the `src`
  const [image, setImage] = useState('');

  useEffect(() => {
    setImage(currentTrack.image);
  }, [currentTrack]);

  return (
    <div className={styles.musicContainer}>
      <div>
        <motion.img
          height="100px"
          width="100px"
          suppressHydrationWarning
          key={currentTrack.name}
          layoutId="track-image"
          className={styles.trackImage}
          src={image}
          alt={currentTrack.name}
        />
      </div>
      <div className={styles.musicInfo}>
        <motion.div layoutId="artist-info" className={styles.artistInfo}>
          <span className={styles.trackName}>{currentTrack.name}</span>
          <span className={styles.artistName}>{currentTrack.artist.name}</span>
        </motion.div>
        <div className={styles.musicControls}>
          <button className={styles.prevTrack} onClick={previousTrack}>
            <svg role="img" height="16" width="16" viewBox="0 0 16 16">
              <path d="M13 2.5L5 7.119V3H3v10h2V8.881l8 4.619z"></path>
            </svg>
          </button>
          <button className={styles.playButton} onClick={togglePlaying}>
            <svg role="img" height="16" width="16" viewBox="0 0 16 16">
              {isPlaying ? (
                <>
                  <path fill="none" d="M0 0h16v16H0z"></path>
                  <path d="M3 2h3v12H3zm7 0h3v12h-3z"></path>
                </>
              ) : (
                <path d="M4.018 14L14.41 8 4.018 2z"></path>
              )}
            </svg>
          </button>
          <button className={styles.nextTrack} onClick={nextTrack}>
            <svg role="img" height="16" width="16" viewBox="0 0 16 16">
              <path d="M11 3v4.119L3 2.5v11l8-4.619V13h2V3z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function getDirectionIcon(modifier: string) {
  switch (modifier) {
    case 'left': {
      return '';
    }
    case 'right': {
      return '';
    }
    case 'slight left': {
      return '';
    }
    case 'slight right': {
      return '';
    }
    case 'straight': {
      return '';
    }
    default: {
      return '';
    }
  }
}
