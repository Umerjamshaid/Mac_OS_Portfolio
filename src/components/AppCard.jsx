const AppCard = ({ app }) => {
  const base = import.meta.env.BASE_URL || "/";
  return (
    <div className="flex flex-col items-center gap-3 flex-shrink-0 snap-center">
      <img
        src={app.screenshot}
        alt={`${app.title} screenshot`}
        className="w-[170px] h-[368px] object-cover select-none rounded-none hover:scale-[1.02] transition-transform duration-300"
        draggable={false}
      />

      {/* GitHub Badge Link */}
      <a
        href={app.githubUrl || "https://github.com/Umerjamshaid"}
        target="_blank"
        rel="noreferrer noopener"
        className="hover:scale-105 active:scale-95 transition-transform duration-200 flex-shrink-0"
      >
        <img
          src={`${base}github-badge.svg`}
          alt="View Code on GitHub"
          className="w-[125px] h-[38px] select-none"
          draggable={false}
        />
      </a>
    </div>
  );
};

export default AppCard;
