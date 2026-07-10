const StoreBadge = ({ type, href, available = true }) => {
  const base = import.meta.env.BASE_URL || "/";
  const isAppStore = type === "appstore";
  const label = isAppStore ? "App Store" : "Google Play";
  const badgeSrc = isAppStore ? `${base}app-store-badge.svg` : `${base}google-play-badge.svg`;

  if (!available) {
    return (
      <span
        className="ma-store-badge ma-store-badge--disabled"
        title={`Not available on ${label}`}
        aria-label={`Not available on ${label}`}
      >
        <span className="ma-store-badge__unavailable">
          Not on {label}
        </span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="ma-store-badge"
      aria-label={`Download on ${label}`}
    >
      <img src={badgeSrc} alt={`Download on ${label}`} draggable={false} />
    </a>
  );
};

export default StoreBadge;
