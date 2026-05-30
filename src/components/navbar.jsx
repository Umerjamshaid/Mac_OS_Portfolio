import { useState, useEffect } from "react"
import dayjs from "dayjs"
import { navIcons, navLinks } from "#constants"
import useWindowStore from "#store/window"
import useDesktopStore from "#store/desktop"

const navbar = () => {
  const { openWindow } = useWindowStore();
  const { toggleSpotlight } = useDesktopStore();
  const [time, setTime] = useState(dayjs());

  useEffect(() => {
    const id = setInterval(() => setTime(dayjs()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleIconClick = (id) => {
    if (id === 2) toggleSpotlight();
  };

  return (
    <nav>
      <div>
        <img src={`${import.meta.env.BASE_URL}images/logo.svg`} alt="logo" />
        <p className="font-bold">Umer's Portfolio</p>

        <ul>
          {navLinks.map(({ id, name, type }) => (
            <li key={id} onClick={() => openWindow(type)}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul>
          {navIcons.map(({ id, img }) => (
            <li
              key={id}
              onClick={() => handleIconClick(id)}
              className={id === 2 ? "cursor-pointer" : ""}
            >
              <img src={img} className="icon" alt={`icon-${id}`} />
            </li>
          ))}
        </ul>

        <time>{time.format("ddd MMM D h:mm:ss A")}</time>
      </div>
    </nav>
  )
}

export default navbar
