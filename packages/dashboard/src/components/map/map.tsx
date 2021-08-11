import useDirections from '@/hooks/use-directions';
import Directions from '@/types/directions';
import Geocode from '@/types/geocode';
import type { Feature, GeoJsonProperties, Geometry } from 'geojson';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import styles from './map.module.css';

type Coords = [lon: number, lat: number];

function formatDirectionsURL(origin: Coords, destination: Coords) {
  return `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${encodeURIComponent(
    `${origin.join(',')};${destination.join(',')}`
  )}?alternatives=true&geometries=geojson&steps=true&access_token=${
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  }`;
}

function formatGeocodeURL(location: string) {
  return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    location
  )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
}

async function geocodeLocation(location: string): Promise<Coords> {
  const res = await fetch(formatGeocodeURL(location));
  const data = (await res.json()) as Geocode.RootObject;
  const [lon, lat] = data.features[0].center;

  return [lon, lat];
}

async function getDirections(from: Coords, to: Coords) {
  const res = await fetch(formatDirectionsURL(from, to));
  const data = (await res.json()) as Directions.RootObject;

  return data;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Map() {
  const { routeIndex, setDirections, setRouteIndex } = useDirections();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const geolocationControlRef = useRef<mapboxgl.GeolocateControl | null>(null);
  const currentCoords = useRef<Coords | null>(null);
  const { finalTranscript } = useSpeechRecognition({
    commands: [
      {
        command: '(show) directions from * to *',
        callback: (origin, destination) => {
          const showDirections = async () => {
            setRouteIndex(0);

            const [originCoords, destinationCoords] = await Promise.all([
              origin.toLowerCase() === 'my location'
                ? Promise.resolve(currentCoords.current!)
                : geocodeLocation(origin),
              geocodeLocation(destination),
            ]);
            const map = mapRef.current!;

            map.fitBounds([
              new mapboxgl.LngLat(...originCoords),
              new mapboxgl.LngLat(...destinationCoords),
            ]);

            const directionsData = await getDirections(
              originCoords,
              destinationCoords
            );
            const route = directionsData.routes[routeIndex];
            const directions = route.legs[0].steps.map(step => {
              return step.maneuver.instruction;
            });

            setDirections(directions);

            const geojson: Feature<Geometry, GeoJsonProperties> = {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route.geometry.coordinates,
              },
            };

            if (map.getSource('route')) {
              (map.getSource('route') as any).setData(geojson);
            } else {
              map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                  type: 'geojson',
                  data: geojson,
                },
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round',
                },
                paint: {
                  'line-color': '#066adb',
                  'line-width': 12,
                  'line-opacity': 0.75,
                },
              });

              map.flyTo({
                pitch: 0,
                bearing: 0,
                zoom: 8,
              });
            }
          };

          showDirections();
        },
      },
      {
        command: '*',
        callback: console.log,
      },
    ],
  });

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        currentCoords.current = [coords.longitude, coords.latitude];
      },
      err => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

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

    mapRef.current = map;

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

    geolocationControlRef.current = geolocationControl;

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
