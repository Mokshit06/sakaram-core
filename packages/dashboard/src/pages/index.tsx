import { OrbitControls } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import { Suspense } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Model() {
  const gltf = useLoader(GLTFLoader, '/scene.gltf');

  return (
    // <mesh>
    <primitive
      object={gltf.scene}
      // scale={0.4}
    />
    // </mesh>
  );
}

export default function Home() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas>
        <Suspense fallback={'Rendering'}>
          <Model />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
