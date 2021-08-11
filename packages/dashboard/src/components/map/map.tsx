import mapboxgl from 'mapbox-gl';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import styles from './map.module.css';

type Coords = {
  lon: number;
  lat: number;
};

function formatDirectionsURL(from: Coords, to: Coords) {
  return `https://api.mapbox.com/directions/v5/mapbox/driving/${encodeURIComponent(
    `${from.lon},${from.lat};${to.lon},${to.lat}`
  )}?alternatives=true&geometries=geojson&steps=true&access_token=${
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  }`;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Map() {
  const router = useRouter();
  const { finalTranscript } = useSpeechRecognition();

  useEffect(() => {
    console.log({ finalTranscript });
  }, [finalTranscript]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mokshit06/cks6ysuez0lvb18qn8fa2zvdb',
      center: [-74.5, 40],
      zoom: 0,
    });

    const geolocationControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      fitBoundsOptions: {
        maxZoom: 10,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });

    map.addControl(geolocationControl);

    map.on('load', () => {
      geolocationControl.trigger();
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className={styles.mapWrapper}>
      <div id="map" className={styles.map}></div>
    </div>
  );
}
