export default function CustomizeTitle({title}){
    return (
        <h1>
            {title.split("").map((char, index) => {
                return (<span
                    key={index}
                    style={{
                        opacity: 1 - index / title.length,
                    }}
                >
            {char}
          </span>);
            })}

        </h1>
    )
}