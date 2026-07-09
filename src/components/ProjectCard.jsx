import { COLORS } from "../constants/data";
import { LinkIcon } from "./Icons";

const ProjectCard = ({ item }) => {
  const c = COLORS[item.color];
  return (
    <div className="group rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:bg-white/90 flex flex-col cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`h-2.5 w-2.5 rounded-full ${c.dot} shadow-sm`} />
          <h3 className="font-mono text-base font-semibold text-gray-900">{item.title}</h3>
        </div>
        <span className={`${c.text} text-lg opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}>
          ↗
        </span>
      </div>
      <p className="mt-3 text-sm text-gray-500 flex-grow leading-relaxed">{item.desc}</p>
      <div className={`mt-6 inline-flex items-center gap-1.5 rounded-full ${c.bg} ${c.text} px-3 py-1 text-xs font-medium w-fit`}>
        <LinkIcon /> {item.url}
      </div>
    </div>
  );
};

export default ProjectCard;
