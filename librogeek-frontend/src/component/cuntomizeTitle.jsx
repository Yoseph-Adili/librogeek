import {useEffect, useRef, useState} from "react";

export default function CustomizeTitle({title}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const observe = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observe.disconnect()
                }
            },
            {
                threshold: 0.1
            }
        )
        if (ref.current) observe.observe(ref.current);

        return () => observe.disconnect()

    }, []);
    return (

        <h1 ref={ref} className={`customize-title ${visible ? "visible" : ""}`}>
            {title.split("").map((char, index) => {
                return (<span
                    key={index}
                    style={{
                        '--i': index,
                        opacity: 1 - index / title.length,
                    }}
                >
            {char}
          </span>);
            })}

        </h1>
    )
}