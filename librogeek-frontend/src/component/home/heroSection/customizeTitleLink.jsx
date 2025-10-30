import {Link} from "react-router-dom";
import {useState} from "react";

const CustomizeTitleLink = ({to, children, startUp = true, ...props}) => {
    const [linkHover, setLinkHover] = useState(false);

    function hoverEffect(trueOrFalse) {
        // const background = document.querySelector(".title-link-background");
        if (trueOrFalse) {
            setLinkHover(true);



        } else {
            setLinkHover(false);

        }
    }

    return (
        <Link
            to={to}
            {...props}
            onMouseEnter={() => hoverEffect(true)}
            onMouseLeave={() => hoverEffect(false)}
            style={{zIndex: linkHover ? 5 : 0}}
        >
            {children.split("").map((char, index) => {

                const direction = startUp ? index % 2 === 0 ? -1 : 1 : index % 2 === 0 ? 1 : -1;

                return (<span
                    key={index}
                    style={{
                        transform: linkHover ? `translateY(${((index % 3) * 5 + 5) * direction}px) rotate(${((index % 3) * 5 + 5) * direction}deg)` : ``,

                    }}
                >
            {char}
          </span>);
            })}

        </Link>

    );
};

export default CustomizeTitleLink;