import { useState } from "react";
import StoreBadge from "./StoreBadge";

const AppCard = ({ app }) => {
  const [hovered, setHovered] = useState(false);
  const base = import.meta.env.BASE_URL || "/";

  return (
    <article
      className="ma-app-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="ma-app-card__preview">
        <img
          src={app.screenshot}
          alt={`${app.title} screenshot`}
          className="ma-app-card__screenshot"
          draggable={false}
        />
      </div>

      <h3 className="ma-app-card__title">{app.title}</h3>

      <div className={`ma-app-card__tags ${hovered ? "ma-app-card__tags--visible" : ""}`}>
        {app.tags?.map((tag) => (
          <span key={tag} className="ma-app-card__tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="ma-app-card__stores">
        <StoreBadge
          type="appstore"
          href={app.appStoreUrl}
          available={Boolean(app.appStoreUrl)}
        />
        <StoreBadge
          type="playstore"
          href={app.playStoreUrl}
          available={Boolean(app.playStoreUrl)}
        />
      </div>

      {app.githubUrl && (
        <a
          href={app.githubUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={`ma-app-card__github ${hovered ? "ma-app-card__github--hover" : ""}`}
          aria-label={`View ${app.title} source on GitHub`}
        >
          <img src={`${base}github-badge.svg`} alt="View code on GitHub" draggable={false} />
        </a>
      )}
    </article>
  );
};

export default AppCard;
