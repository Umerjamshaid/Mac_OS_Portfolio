import { WALLPAPERS } from "#constants";
import useDesktopStore from "#store/desktop";

const Wallpaper = () => {
  const activeWallpaperId = useDesktopStore((s) => s.activeWallpaperId);
  const wallpaper = WALLPAPERS.length > 0 
    ? (WALLPAPERS.find((w) => w.id === activeWallpaperId) ?? WALLPAPERS[0])
    : null;

  // Handle empty WALLPAPERS array
  if (!wallpaper) {
    return (
      <div className="fixed inset-0 h-full w-full -z-10 bg-gradient-to-br from-gray-800 to-gray-900" />
    );
  }

  if (wallpaper.type === "video") {
    return (
      <video
        key={wallpaper.src}
        className="fixed inset-0 h-full w-full object-cover -z-10"
        src={wallpaper.src}
        poster={wallpaper.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <img
      key={wallpaper.src}
      className="fixed inset-0 h-full w-full object-cover -z-10"
      src={wallpaper.src}
      alt="Desktop wallpaper"
      draggable={false}
    />
  );
};

export default Wallpaper;
