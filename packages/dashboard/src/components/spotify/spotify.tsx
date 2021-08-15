import useWindow from '@/hooks/use-window';

export default function Spotify() {
  const closeApp = useWindow(state => state.closeApp);

  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
        padding: '1rem',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
      }}
    >
      Spotify
    </div>
  );
}
