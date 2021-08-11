import mapboxgl from 'mapbox-gl';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useRef, useState } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import styles from './map.module.css';

type Coords = {
  lon: number;
  lat: number;
};

/**
 * matches against :-
 * - `directions for delhi`
 * - `drive to delhi`
 * - `direction for delhi india`
 */
const DIRECTION_REGEX =
  /^(directions?|drive) (to|for) (?<location>(\w+|\s+)+)/i;
const START_REGEX = /^start$/i;
const OPEN_APP_REGEX = /^open (?<appName>)$/i;

function formatDirectionsURL(from: Coords, to: Coords) {
  return `https://api.mapbox.com/directions/v5/mapbox/driving/${encodeURIComponent(
    `${from.lon},${from.lat};${to.lon},${to.lat}`
  )}?alternatives=true&geometries=geojson&steps=true&access_token=${
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  }`;
}

type TranscriptDataType = 'DIRECTION' | 'START' | 'OPEN_APP';
type TranscriptData = {
  type: TranscriptDataType;
  data?: any;
};

// TODO use dialogflow instead of regex
function getTranscriptData(transcript: string): TranscriptData | null {
  transcript = transcript.trim();
  let data: TranscriptData | null = null;

  if (transcript.match(DIRECTION_REGEX)) {
    const result = DIRECTION_REGEX.exec(transcript);

    if (result?.groups?.location) {
      data = {
        type: 'DIRECTION',
        data: result.groups.location,
      };
    }
  } else if (transcript.match(START_REGEX)) {
    data = { type: 'START' };
  } else if (transcript.match(OPEN_APP_REGEX)) {
    const result = OPEN_APP_REGEX.exec(transcript);

    if (result?.groups?.appName) {
      data = {
        type: 'OPEN_APP',
        data: result.groups.appName,
      };
    }
  }

  return data;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Map() {
  const router = useRouter();
  const { finalTranscript } = useSpeechRecognition();
  const [targetLocation, setTargetLocation] = useState<string | null>(null);
  const targetLocationRef = useRef<string | null>(null);

  useEffect(() => {
    targetLocationRef.current = targetLocation;
  }, [targetLocation]);

  useEffect(() => {
    const data = getTranscriptData(finalTranscript);
    if (!data) return;

    // TODO respond with something
    switch (data.type) {
      case 'DIRECTION': {
        console.log('SHOWING DIRECTIONS');
        setTargetLocation(data.data);
        break;
      }
      case 'START': {
        if (targetLocationRef.current) {
          console.log('DRIVE STARTED');
          // TODO show directions and route on map
        } else {
          // TODO respond with some error
        }
      }
      case 'OPEN_APP': {
        console.log('OPENING APP');
        // TODO slide in the app mentioned
        setTargetLocation(null);
        break;
      }
    }
  }, [finalTranscript]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mokshit06/cks6ysuez0lvb18qn8fa2zvdb',
      // default coords
      center: [-74.0066, 40.7135],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true,
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
      const layers = map.getStyle().layers;

      if (!layers) return;

      const labelLayerId = layers.find(
        layer => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      map.addLayer(
        {
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#0a0f16',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.8,
          },
        },
        labelLayerId
      );
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
