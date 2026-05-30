import { useState, useEffect } from "react"
import dayjs from "dayjs"
import { navIcons, navLinks } from "#constants"
import useWindowStore from "#store/window"
import useDesktopStore from "#store/desktop"
import WifiPopup from "./WifiPopup"

const navbar = () => {
  const { openWindow } = useWindowStore();
  const { toggleSpotlight } = useDesktopStore();
  const [time, setTime] = useState(dayjs());
  const [wifiOpen, setWifiOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(dayjs()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleIconClick = (id) => {
    if (id === 1) setWifiOpen((v) => !v);
    if (id === 2) toggleSpotlight();
  };

  return (
    <>
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
                className="cursor-pointer"
              >
                <img
                  src={img}
                  className={`icon${id === 1 && wifiOpen ? " opacity-60" : ""}`}
                  alt={`icon-${id}`}
                />
              </li>
            ))}
          </ul>

          <time>{time.format("ddd MMM D h:mm:ss A")}</time>
        </div>
      </nav>

      {wifiOpen && <WifiPopup onClose={() => setWifiOpen(false)} />}
    </>
  )
}

export default navbar
