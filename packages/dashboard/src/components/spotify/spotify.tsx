import useMusic from '@/hooks/use-music';
import useWindow from '@/hooks/use-window';
import styles from './spotify.module.css';

export default function Spotify() {
  const closeApp = useWindow(state => state.closeApp);
  const time = getTime(new Date().getHours());
  const { currentTrackIndex, tracks } = useMusic();
  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className={styles.container}>
      <div
        className={styles.header}
        style={{ backgroundColor: 'rgb(240, 48, 144)' }}
      >
        <h2>Good {time}</h2>
        <div className={styles.playlists}>
          {tracks.map(track => (
            <TrackCard key={track.name} src={track.image} title={track.name} />
          ))}
          {/* <PlaylistCard
            src="https://mosaic.scdn.co/640/ab67616d00001e0273242fe0060e61cf603b2380ab67616d00001e028c72151621d5c60ed768d010ab67616d00001e02b6fd97b36537492b464461a1ab67616d00001e02cdf7d1d8ff13c3360a8c033d"
            title="_"
          /> */}
        </div>
      </div>
      <div className={styles.section}>
        <h2>Made for you</h2>
        <div className={styles.medias}>
          <MediaCard
            name="Discover Weekly"
            description="Your weekly mixtape of fresh music. Enjoy new music and deep cuts picked for you. Updates every Monday."
            src="https://newjams-images.scdn.co/image/ab676477000033ad/dt/v3/discover-weekly/aAbca4VNfzWuUCQ_FGiEFA==/bmVuZW5lbmVuZW5lbmVuZQ=="
          />
          <MediaCard
            name="Discover Weekly"
            description="Your weekly mixtape of fresh music. Enjoy new music and deep cuts picked for you. Updates every Monday."
            src="https://newjams-images.scdn.co/image/ab676477000033ad/dt/v3/discover-weekly/aAbca4VNfzWuUCQ_FGiEFA==/bmVuZW5lbmVuZW5lbmVuZQ=="
          />
        </div>
      </div>
    </div>
  );
}

function getTime(hours: number) {
  if (hours <= 12) return 'morning';
  if (hours <= 17) return 'afternoon';
  if (hours <= 20) return 'evening';
  return 'night';
}

function TrackCard({ src, title }: { src: string; title: string }) {
  return (
    <div className={styles.playlist}>
      <div className={styles.playlistImage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={title} />
      </div>
      <div className={styles.playlistInfo}>
        <p>{title}</p>
      </div>
    </div>
  );
}

function MediaCard({
  src,
  description,
  name,
}: {
  src: string;
  name: string;
  description: string;
}) {
  return (
    <div className={styles.media}>
      <div>
        <div className={styles.mediaImage}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" />
        </div>
        <div className={styles.mediaInfo}>
          <div className={styles.mediaName}>{name}</div>
          <p className={styles.mediaDescription}>{description}</p>
        </div>
      </div>
    </div>
  );
}
