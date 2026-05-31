import { WALLPAPERS } from "#constants";
import useDesktopStore from "#store/desktop";

const Wallpaper = () => {
  const activeWallpaperId = useDesktopStore((s) => s.activeWallpaperId);
  const wallpaper = WALLPAPERS.find((w) => w.id === activeWallpaperId) ?? WALLPAPERS[0];

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
