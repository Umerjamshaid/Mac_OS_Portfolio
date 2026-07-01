import { useState, useCallback } from "react";
import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import {
  ChevronLeft, ChevronRight, X, ZoomIn,
  Heart, Share2, Trash2, Grid, Rows3,
  Image, Sparkles, Briefcase, Users,
} from "lucide-react";

const base = import.meta.env.BASE_URL;

const SIDEBAR_SECTIONS = [
  {
    heading: "Library",
    items: [
      { id: "allPhotos", label: "All Photos", Icon: Image   },
      { id: "memories",  label: "Memories",   Icon: Sparkles },
      { id: "favorites", label: "Favorites",  Icon: Heart   },
    ],
  },
  {
    heading: "Albums",
    items: [
      { id: "projects", label: "Projects", Icon: Briefcase },
      { id: "people",   label: "People",   Icon: Users     },
    ],
  },
];

const PHOTOS = [
  { id: 1, src: `${base}images/gal1.png`,      label: "Morning Light",      date: "May 2025",  album: "allPhotos", fav: true  },
  { id: 2, src: `${base}images/gal2.png`,      label: "Golden Hour",        date: "Apr 2025",  album: "allPhotos", fav: false },
  { id: 3, src: `${base}images/gal3.png`,      label: "Blue Skies",         date: "Mar 2025",  album: "allPhotos", fav: true  },
  { id: 4, src: `${base}images/gal4.png`,      label: "Sunset Vibes",       date: "Feb 2025",  album: "allPhotos", fav: false },
  { id: 5, src: `${base}images/project-1.png`, label: "Nike eCommerce",     date: "Jan 2025",  album: "projects",  fav: false },
  { id: 6, src: `${base}images/project-2.png`, label: "AI Resume Analyzer", date: "Dec 2024",  album: "projects",  fav: true  },
  { id: 7, src: `${base}images/project-3.png`, label: "Food Delivery App",  date: "Nov 2024",  album: "projects",  fav: false },
  { id: 8, src: `${base}images/umer.jpg`,       label: "Profile",            date: "Oct 2024",  album: "people",    fav: true  },
];

const MEMORIES = [
  { id: "mem1", title: "Spring 2025",        cover: `${base}images/gal1.png`,      count: 3 },
  { id: "mem2", title: "Project Highlights", cover: `${base}images/project-1.png`, count: 3 },
  { id: "mem3", title: "Team & People",      cover: `${base}images/umer.jpg`,       count: 1 },
];

const getPhotosForSection = (section) => {
  if (section === "allPhotos") return PHOTOS;
  if (section === "favorites") return PHOTOS.filter((p) => p.fav);
  if (section === "memories")  return null;
  return PHOTOS.filter((p) => p.album === section);
};

const Lightbox = ({ photo, photos, onClose, onPrev, onNext, onGoTo }) => {
  const idx = photos.findIndex((p) => p.id === photo.id);
  return (
    <div className="absolute inset-0 z-50 bg-black/95 flex flex-col" onClick={onClose}>
      <div className="flex items-center justify-between px-4 py-3 text-white/80" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <X size={16} />
          </button>
          <span className="text-sm font-medium text-white/70">{idx + 1} / {photos.length}</span>
        </div>
        <p className="text-sm font-medium">{photo.label}</p>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <Heart size={15} className={photo.fav ? "text-red-400 fill-red-400" : ""} />
          </button>
          <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <Share2 size={15} />
          </button>
          <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-red-400/80">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-12 relative" onClick={(e) => e.stopPropagation()}>
        {idx > 0 && (
          <button onClick={onPrev} className="absolute left-3 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
            <ChevronLeft size={20} />
          </button>
        )}
        <img
          src={photo.src}
          alt={photo.label}
          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        />
        {idx < photos.length - 1 && (
          <button onClick={onNext} className="absolute right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => onGoTo(i)}
            onClick={() => {
              // Jump directly to clicked thumbnail
              const delta = i - idx;
              if (delta > 0) {
                for (let j = 0; j < delta; j++) onNext();
              } else if (delta < 0) {
                for (let j = 0; j < -delta; j++) onPrev();
              }
            }}
            className={`flex-shrink-0 rounded-md overflow-hidden transition-all ${
              p.id === photo.id ? "ring-2 ring-white scale-110" : "opacity-50 hover:opacity-75"
            }`}
          >
            <img src={p.src} alt={p.label} className="w-12 h-9 object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

const PhotoGrid = ({ photos, onSelect, viewMode }) => {
  if (viewMode === "rows") {
    return (
      <div className="p-4 space-y-1">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => onSelect(photo)}
            className="flex items-center gap-3 w-full hover:bg-gray-100 rounded-lg p-2 transition-colors group text-left"
          >
            <img src={photo.src} alt={photo.label} className="w-12 h-10 object-cover rounded-md flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{photo.label}</p>
              <p className="text-xs text-gray-400">{photo.date}</p>
            </div>
            {photo.fav && <Heart size={13} className="text-red-400 fill-red-400 flex-shrink-0" />}
            <ZoomIn size={13} className="text-gray-300 group-hover:text-gray-400 flex-shrink-0 transition-colors" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="p-3 grid grid-cols-3 gap-1.5">
      {photos.map((photo) => (
        <button
          key={photo.id}
          onClick={() => onSelect(photo)}
          className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
        >
          <img
            src={photo.src}
            alt={photo.label}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {photo.fav && (
            <div className="absolute top-1.5 right-1.5">
              <Heart size={11} className="text-red-400 fill-red-400 drop-shadow" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <p className="absolute bottom-0 inset-x-0 text-[10px] text-white font-medium px-1.5 py-1 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity truncate">
            {photo.label}
          </p>
        </button>
      ))}
    </div>
  );
};

const MemoriesView = ({ onPickMemory }) => (
  <div className="p-4">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">For You</p>
    <div className="grid grid-cols-2 gap-3">
      {MEMORIES.map((mem) => (
        <button
          key={mem.id}
          onClick={() => onPickMemory(mem)}
          className="relative rounded-xl overflow-hidden aspect-[4/3] group shadow-sm"
        >
          <img src={mem.cover} alt={mem.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-2 left-3 text-left">
            <p className="text-white text-sm font-semibold leading-tight">{mem.title}</p>
            <p className="text-white/60 text-[10px]">{mem.count} photos</p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const Photos = () => {
  const [activeSection, setActiveSection] = useState("allPhotos");
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  const sectionPhotos = getPhotosForSection(activeSection);

  const handleSelect = useCallback((photo) => setLightboxPhoto(photo), []);

  const handleNext = useCallback(() => {
    if (!lightboxPhoto || !sectionPhotos) return;
    const idx = sectionPhotos.findIndex((p) => p.id === lightboxPhoto.id);
    if (idx < sectionPhotos.length - 1) setLightboxPhoto(sectionPhotos[idx + 1]);
  }, [lightboxPhoto, sectionPhotos]);

  const handlePrev = useCallback(() => {
    if (!lightboxPhoto || !sectionPhotos) return;
    const idx = sectionPhotos.findIndex((p) => p.id === lightboxPhoto.id);
    if (idx > 0) setLightboxPhoto(sectionPhotos[idx - 1]);
  }, [lightboxPhoto, sectionPhotos]);

  const handleGoTo = useCallback((index) => {
    if (!sectionPhotos || index < 0 || index >= sectionPhotos.length) return;
    setLightboxPhoto(sectionPhotos[index]);
  }, [sectionPhotos]);

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-white">
      <div id="window-header" className="flex-shrink-0">
        <WindowControls target="photos" />
        <div className="flex items-center gap-1.5 mx-auto">
          <button className="p-0.5 rounded hover:bg-gray-200 transition-colors text-gray-400">
            <ChevronLeft size={14} />
          </button>
          <p className="text-xs font-semibold text-gray-600 min-w-20 text-center">
            {SIDEBAR_SECTIONS.flatMap((s) => s.items).find((i) => i.id === activeSection)?.label ?? "Library"}
          </p>
          <button className="p-0.5 rounded hover:bg-gray-200 transition-colors text-gray-400">
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1 rounded transition-colors ${viewMode === "grid" ? "bg-gray-200 text-gray-700" : "text-gray-400 hover:bg-gray-100"}`}
          >
            <Grid size={13} />
          </button>
          <button
            onClick={() => setViewMode("rows")}
            className={`p-1 rounded transition-colors ${viewMode === "rows" ? "bg-gray-200 text-gray-700" : "text-gray-400 hover:bg-gray-100"}`}
          >
            <Rows3 size={13} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="photos-sidebar">
          <p className="text-base font-bold text-gray-800 px-3 mb-3">Photos</p>
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.heading} className="mb-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
                {section.heading}
              </p>
              {section.items.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      isActive ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.Icon
                      size={14}
                      className={isActive ? "text-blue-600" : "text-gray-400"}
                    />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto bg-white relative">
          {activeSection === "memories" ? (
            <MemoriesView onPickMemory={() => setActiveSection("allPhotos")} />
          ) : sectionPhotos && sectionPhotos.length > 0 ? (
            <PhotoGrid photos={sectionPhotos} onSelect={handleSelect} viewMode={viewMode} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <Image size={32} className="text-gray-300" />
              <p className="text-sm">No photos here</p>
            </div>
          )}
        </div>
      </div>

      {lightboxPhoto && sectionPhotos && (
        <Lightbox
          photo={lightboxPhoto}
          photos={sectionPhotos}
          onClose={() => setLightboxPhoto(null)}
          onNext={handleNext}
          onPrev={handlePrev}
          onGoTo={handleGoTo}
        />
      )}
    </div>
  );
};

const PhotosWindow = WindowWrapper(Photos, "photos");
export default PhotosWindow;
