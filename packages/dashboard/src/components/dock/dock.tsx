import useDirections from '@/hooks/use-directions';
import { AnimatePresence, motion } from 'framer-motion';
import { RefObject, useEffect, useRef } from 'react';
import styles from './dock.module.css';

type DockProps = {
  containerRef: RefObject<HTMLDivElement>;
};

export default function Dock({ containerRef }: DockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const { directions } = useDirections();
  const modifyTarget = (target: number) => {
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
  };

  useEffect(() => {
    console.log(directions);
  }, [directions]);

  return (
    <motion.div
      className={styles.dock}
      layoutId="box"
      initial={false}
      dragTransition={{
        modifyTarget,
        power: 0,
        min: 0,
        max: 200,
        timeConstant: 250,
      }}
      ref={dockRef}
      // animate={}
      drag
      dragConstraints={containerRef}
      dragElastic={1}
    >
      <ul style={{ overflow: 'hidden' }}>
        <AnimatePresence initial={false}>
          {directions.map((direction, index) => {
            return (
              <motion.li
                key={`${direction}-${index}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
              >
                {direction}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}
