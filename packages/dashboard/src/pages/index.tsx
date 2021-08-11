// import { Environment, OrbitControls } from '@react-three/drei';
// import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { Suspense } from 'react';
import Navigation from '../components/navigation/navigation';
import CarWindow from '../components/car-window/car-window';
import Map from '../components/map/map';
import styles from '../styles/home.module.css';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// function Model() {
//   // const gltf = useLoader(GLTFLoader, '/scene.gltf');

//   // console.log(gltf);

//   return null;

//   return (
//     // <mesh>
//     <primitive object={gltf.scene} scale={0.4} />
//     // </mesh>
//   );
// }

// function Car() {
//   return (
//     <div style={{ height: '100vh', width: '100vw' }}>
//       <h1>Hello world</h1>
//       <Canvas>
//         <Suspense fallback={null}>
//           <Model />
//           <OrbitControls />
//           <Environment preset="city" background={true} />
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// }

export default function Home() {
  return (
    <div className={styles.container}>
      <Navigation />
      {/* <CarWindow /> */}
      {/* <Car /> */}
      <Map />
    </div>
  );
}
