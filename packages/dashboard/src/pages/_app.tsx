import 'regenerator-runtime';
import { AnimateSharedLayout } from 'framer-motion';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AnimateSharedLayout type="crossfade">
      <Component {...pageProps} />
    </AnimateSharedLayout>
  );
}

export default MyApp;
