// import { Environment, OrbitControls } from '@react-three/drei';
// import { Canvas, useLoader, useThree } from '@react-three/fiber';
import Dock from '@/components/dock/dock';
import Map from '@/components/map/map';
import Navigation from '@/components/navigation/navigation';
import styles from '@/styles/home.module.css';
import { AnimateSharedLayout } from 'framer-motion';
import { useRef } from 'react';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.container}>
      <Navigation />
      {/* <CarWindow /> */}
      {/* <Car /> */}
      <AnimateSharedLayout>
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            overflow: 'hidden',
            width: 'calc(100vw - var(--nav-width))',
          }}
        >
          <Dock containerRef={containerRef} />
          <Map />
        </div>
      </AnimateSharedLayout>
    </div>
  );
}
