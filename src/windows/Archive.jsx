import { useState } from "react";
import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import {
  Archive,
  Box,
  FlaskConical,
  Clock,
  Tag,
  AlertTriangle,
  FolderOpen,
  Layers,
} from "lucide-react";

const FILTERS = [
  { id: "all", label: "All Items", Icon: Archive },
  { id: "deprecated", label: "Deprecated", Icon: AlertTriangle },
  { id: "experiments", label: "Experiments", Icon: FlaskConical },
  { id: "legacy", label: "Legacy", Icon: Clock },
];

const ARCHIVE_ITEMS = [
  {
    id: 1,
    title: "Old Portfolio v1",
    category: "legacy",
    date: "Jan 2023",
    description: "First iteration of my personal portfolio built with plain HTML/CSS and a splash of jQuery.",
    tags: ["HTML", "CSS", "jQuery"],
    color: "bg-amber-50 text-amber-700",
    iconColor: "bg-amber-100 text-amber-600",
  },
  {
    id: 2,
    title: "Flutter Game Engine",
    category: "experiments",
    date: "Mar 2024",
    description: "A lightweight 2D game engine experiment using Flutter's CustomPainter. Abandoned in favor of Flame.",
    tags: ["Flutter", "Dart", "Canvas"],
    color: "bg-sky-50 text-sky-700",
    iconColor: "bg-sky-100 text-sky-600",
  },
  {
    id: 3,
    title: "Node.js CMS",
    category: "deprecated",
    date: "Jun 2023",
    description: "Custom headless CMS built with Express and MongoDB. Replaced by Sanity/Strapi for production projects.",
    tags: ["Node.js", "MongoDB", "Express"],
    color: "bg-rose-50 text-rose-700",
    iconColor: "bg-rose-100 text-rose-600",
  },
  {
    id: 4,
    title: "Python Automation Scripts",
    category: "legacy",
    date: "Nov 2022",
    description: "Collection of Selenium + BeautifulSoup scrapers for market research. Retired after APIs became available.",
    tags: ["Python", "Selenium", "BS4"],
    color: "bg-violet-50 text-violet-700",
    iconColor: "bg-violet-100 text-violet-600",
  },
  {
    id: 5,
    title: "React Native Chat App",
    category: "experiments",
    date: "Aug 2024",
    description: "Real-time chat prototype using Firebase and React Native. Served as learning material for Socket.io migration.",
    tags: ["React Native", "Firebase", "RN"],
    color: "bg-emerald-50 text-emerald-700",
    iconColor: "bg-emerald-100 text-emerald-600",
  },
  {
    id: 6,
    title: "PHP Dashboard",
    category: "deprecated",
    date: "Feb 2023",
    description: "Admin dashboard built with raw PHP and Bootstrap. Superseded by Next.js + Tailwind stack.",
    tags: ["PHP", "Bootstrap", "MySQL"],
    color: "bg-gray-50 text-gray-700",
    iconColor: "bg-gray-200 text-gray-600",
  },
];

const CATEGORY_META = {
  deprecated: { color: "text-rose-500", bg: "bg-rose-50" },
  experiments: { color: "text-sky-500", bg: "bg-sky-50" },
  legacy: { color: "text-amber-500", bg: "bg-amber-50" },
};

const Archive = () => {
  const [filter, setFilter] = useState("all");
  const items =
    filter === "all"
      ? ARCHIVE_ITEMS
      : ARCHIVE_ITEMS.filter((i) => i.category === filter);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div
        id="window-header"
        className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200"
      >
        <WindowControls target="archive" />
        <div className="flex items-center gap-2 flex-1 justify-center">
          <Archive size={13} className="text-gray-500" />
          <span className="text-xs font-semibold text-gray-600">Archive</span>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-44 flex-shrink-0 bg-gray-50/80 border-r border-gray-200 overflow-y-auto py-3 px-2">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
            Filters
          </p>
          {FILTERS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors duration-100 text-left ${
                filter === id
                  ? "bg-blue-500/10 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-200/60"
              }`}
            >
              <Icon size={14} />
              <span className="text-xs">{label}</span>
              <span
                className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  filter === id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {id === "all"
                  ? ARCHIVE_ITEMS.length
                  : ARCHIVE_ITEMS.filter((i) => i.category === id).length}
              </span>
            </button>
          ))}

          <div className="mt-4 px-2">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Storage
            </p>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>Used</span>
                  <span>6 items</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-[60%] bg-gray-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center">
                <Archive size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-600">
                Nothing here yet
              </p>
              <p className="text-xs text-gray-400 max-w-[200px]">
                Archived items will appear in this folder when added.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {items.map((item) => {
                const meta = CATEGORY_META[item.category] || CATEGORY_META.legacy;
                return (
                  <div
                    key={item.id}
                    className="group flex flex-col gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm hover:bg-gray-50/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconColor}`}
                        >
                          {item.category === "deprecated" ? (
                            <AlertTriangle size={18} />
                          ) : item.category === "experiments" ? (
                            <FlaskConical size={18} />
                          ) : (
                            <Clock size={18} />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Layers size={10} />
                            {item.date}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${meta.bg} ${meta.color}`}
                      >
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md ${item.color}`}
                        >
                          <Tag size={9} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ArchiveWindow = WindowWrapper(Archive, "archive");
export default ArchiveWindow;
