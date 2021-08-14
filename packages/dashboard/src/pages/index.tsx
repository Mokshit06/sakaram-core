// import { Environment, OrbitControls } from '@react-three/drei';
// import { Canvas, useLoader, useThree } from '@react-three/fiber';
import Dock from '@/components/dock/dock';
import Map from '@/components/map/map';
import Navigation from '@/components/navigation/navigation';
import Window from '@/components/window/window';
import styles from '@/styles/home.module.css';
import { useRef } from 'react';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.container}>
      <Navigation />
      {/* <Car /> */}
      <div ref={containerRef} className={styles.sidePanel}>
        <Dock containerRef={containerRef} />
        <Window />
        <Map />
      </div>
    </div>
  );
}
