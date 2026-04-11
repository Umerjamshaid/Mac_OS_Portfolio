import { useState, useEffect } from "react"
import dayjs from "dayjs"
import { navIcons, navLinks } from "#constants"
import useWindowStore from "#store/window"


const navbar = () => {
    const { openWindow } = useWindowStore(); 
    const [time, setTime] = useState(dayjs());

    useEffect(() => {
      const id = setInterval(() => setTime(dayjs()), 1000);
      return () => clearInterval(id);
    }, []);



  return (
    <nav>
        <div>
            <img src="/images/logo.svg" alt="logo" />
            <p className="font-bold">Umer's Portfolio</p>

            <ul>
                {navLinks.map(({id , name , type}) =>(
                    <li key={id} onClick={() => openWindow(type)}>
                        <p>{name}</p>
                    </li>
                ))}
            </ul>
        </div>

        <div>
            <ul>
                {navIcons.map(({id , img}) => (
                    <li key={id}>
                        <img src={img} className="icon-hover"  alt={`icon-${id}`} />
                    </li>
                ))}
            </ul>

            <time>{time.format("ddd MMM D h:mm:ss A")}</time>
        </div>
    </nav>
  )
}

export default navbar