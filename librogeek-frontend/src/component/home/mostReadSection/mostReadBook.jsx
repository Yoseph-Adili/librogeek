import {Link} from "react-router-dom";
import {useState, useEffect} from "react";

const MostReadBook = ({book_cover, book_link}) => {
    const [coverColor, setCoverColor] = useState("");
    const [coverTextColor, setCoverTextColor] = useState("#141414")
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    useEffect(() => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const img = new Image();
        img.src = book_cover;
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            let r = 0, g = 0, b = 0;
            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
            }
            const pixelCount = data.length / 4;
            r = Math.floor(r / pixelCount);
            g = Math.floor(g / pixelCount);
            b = Math.floor(b / pixelCount);
            setCoverColor(`rgb(${r}, ${g}, ${b})`);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            const textColor = brightness > 128 ? "black" : "white";
            setCoverTextColor(textColor);

        };
    }, [book_cover]);

    const handleMouseMove = (e) => {

        setRotateY(rotateY)
        setRotateX(rotateX)
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;

        const rotateXValue = -yPct * 45;
        const rotateYValue = xPct * 45;
        setRotateX(rotateXValue);
        setRotateY(rotateYValue);

    }


    function resetRotation() {
        setRotateX(0);
        setRotateY(0);
    }

    function changeBackgroundColor(active) {
        const background = document.querySelector(".app");
        if (active) {
            background.style.backgroundColor = coverColor;
            background.style.setProperty("--text-color", coverTextColor);

        } else {
            background.style.backgroundColor = "";
            background.style.removeProperty("--text-color",)
        }
    }

    return (<div className="book-card">
        <Link
            to={book_link}
            onMouseEnter={() => changeBackgroundColor(true)}
            onMouseLeave={() => {
                changeBackgroundColor(false);
                resetRotation();
            }}
            onMouseMove={handleMouseMove}
            style={{
                transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
            }}
        >
            <div
                className="book-cover-background"
                style={{
                    background: coverColor
                }}
            >

                <img src={book_cover} alt=""/>
                <svg className="book-left" viewBox="0 0 58 449" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill={coverColor}/>
                    <path
                        d="M42 337.33L14.56 337.33L14.56 333.53L38.68 333.53L38.68 319.89L42 319.89L42 337.33ZM42 315.884L14.56 315.884L14.56 312.084L42 312.084L42 315.884ZM42 305.22L14.56 305.22L14.56 291.06C14.56 289.487 14.84 288.127 15.4 286.98C15.9333 285.833 16.6933 284.953 17.68 284.34C18.6667 283.7 19.84 283.38 21.2 283.38C22.24 283.38 23.2 283.567 24.08 283.94C24.96 284.313 25.6933 284.833 26.28 285.5C26.8667 286.167 27.3067 286.927 27.6 287.78L27.76 287.78C27.9733 286.82 28.36 285.953 28.92 285.18C29.48 284.407 30.2267 283.793 31.16 283.34C32.0667 282.86 33.1867 282.62 34.52 282.62C36.3067 282.62 37.7467 282.993 38.84 283.74C39.9333 284.487 40.7333 285.487 41.24 286.74C41.7467 287.993 42 289.433 42 291.06L42 305.22ZM38.72 301.42L38.72 291.1C38.72 289.74 38.3733 288.633 37.68 287.78C36.96 286.927 35.7733 286.5 34.12 286.5C33.1067 286.5 32.2667 286.687 31.6 287.06C30.9067 287.433 30.4 287.98 30.08 288.7C29.7333 289.42 29.56 290.327 29.56 291.42L29.56 301.42L38.72 301.42ZM26.32 301.42L26.32 291.78C26.32 290.873 26.1467 290.087 25.8 289.42C25.4267 288.753 24.92 288.233 24.28 287.86C23.6133 287.46 22.8667 287.26 22.04 287.26C20.6 287.26 19.5467 287.647 18.88 288.42C18.1867 289.193 17.84 290.22 17.84 291.5L17.84 301.42L26.32 301.42ZM42 277.29L14.56 277.29L14.56 262.85C14.56 260.984 14.9067 259.437 15.6 258.21C16.2667 256.957 17.2133 256.024 18.44 255.41C19.64 254.797 21.0267 254.49 22.6 254.49C24.4933 254.49 26.12 254.917 27.48 255.77C28.84 256.624 29.8133 257.797 30.4 259.29L42 253.53L42 257.69L31.08 263.05L31.08 273.49L42 273.49L42 277.29ZM27.84 273.49L27.84 263.21C27.84 261.69 27.3733 260.504 26.44 259.65C25.5067 258.77 24.2267 258.33 22.6 258.33C21.5867 258.33 20.7333 258.517 20.04 258.89C19.3467 259.264 18.8133 259.81 18.44 260.53C18.04 261.25 17.84 262.144 17.84 263.21L17.84 273.49L27.84 273.49ZM42.48 236.455C42.48 239.308 41.96 241.762 40.92 243.815C39.88 245.842 38.3067 247.415 36.2 248.535C34.0933 249.628 31.4533 250.175 28.28 250.175C25.08 250.175 22.44 249.628 20.36 248.535C18.2533 247.415 16.68 245.842 15.64 243.815C14.6 241.762 14.08 239.308 14.08 236.455C14.08 233.602 14.6 231.162 15.64 229.135C16.68 227.082 18.2533 225.508 20.36 224.415C22.44 223.295 25.08 222.735 28.28 222.735C31.4533 222.735 34.0933 223.295 36.2 224.415C38.3067 225.508 39.88 227.082 40.92 229.135C41.96 231.162 42.48 233.602 42.48 236.455ZM39.2 236.455C39.2 234.962 39 233.615 38.6 232.415C38.2 231.188 37.5733 230.162 36.72 229.335C35.84 228.482 34.7467 227.828 33.44 227.375C32.1067 226.922 30.5333 226.695 28.72 226.695L27.88 226.695C26.04 226.695 24.4667 226.922 23.16 227.375C21.8267 227.828 20.7333 228.482 19.88 229.335C19 230.162 18.36 231.188 17.96 232.415C17.56 233.615 17.36 234.962 17.36 236.455C17.36 237.975 17.56 239.335 17.96 240.535C18.36 241.735 19 242.762 19.88 243.615C20.7333 244.468 21.8267 245.122 23.16 245.575C24.4667 246.002 26.04 246.215 27.88 246.215L28.72 246.215C30.5333 246.215 32.1067 246.002 33.44 245.575C34.7467 245.122 35.84 244.468 36.72 243.615C37.5733 242.762 38.2 241.735 38.6 240.535C39 239.335 39.2 237.975 39.2 236.455ZM42.48 204.891C42.48 209.318 41.32 212.691 39 215.011C36.68 217.305 33.1067 218.451 28.28 218.451C25.1333 218.451 22.5067 217.918 20.4 216.851C18.2933 215.785 16.72 214.211 15.68 212.131C14.6133 210.051 14.08 207.518 14.08 204.531C14.08 202.665 14.28 200.971 14.68 199.451C15.08 197.931 15.6933 196.625 16.52 195.531C17.32 194.411 18.3333 193.558 19.56 192.971C20.7867 192.358 22.24 192.051 23.92 192.051L23.92 195.931C22.7467 195.931 21.7467 196.145 20.92 196.571C20.0667 196.998 19.3733 197.611 18.84 198.411C18.3067 199.185 17.9333 200.091 17.72 201.131C17.48 202.171 17.36 203.278 17.36 204.451C17.36 206.051 17.56 207.478 17.96 208.731C18.36 209.985 18.9867 211.038 19.84 211.891C20.6933 212.745 21.7867 213.398 23.12 213.851C24.4533 214.305 26.04 214.531 27.88 214.531L28.72 214.531C31.2 214.531 33.2133 214.158 34.76 213.411C36.3067 212.638 37.44 211.531 38.16 210.091C38.8533 208.651 39.2 206.918 39.2 204.891C39.2 202.838 38.92 201.145 38.36 199.811C37.7733 198.478 36.8933 197.491 35.72 196.851C34.5467 196.185 33.0667 195.851 31.28 195.851L30.8 195.851L30.8 205.531L27.56 205.531L27.56 192.011L42 192.011L42 194.891L38.52 195.291C39.4533 196.011 40.2133 196.865 40.8 197.851C41.3867 198.838 41.8133 199.931 42.08 201.131C42.3467 202.305 42.48 203.558 42.48 204.891ZM42 185.415L14.56 185.415L14.56 164.295L17.84 164.295L17.84 181.615L26.32 181.615L26.32 166.055L29.6 166.055L29.6 181.615L38.72 181.615L38.72 164.055L42 164.055L42 185.415ZM42 158.345L14.56 158.345L14.56 137.225L17.84 137.225L17.84 154.545L26.32 154.545L26.32 138.985L29.6 138.985L29.6 154.545L38.72 154.545L38.72 136.985L42 136.985L42 158.345ZM42 131.275L14.56 131.275L14.56 127.475L29.08 127.475L14.56 113.515L14.56 108.795L25.52 119.235L42 108.435L42 112.955L28.24 121.875L33.52 127.475L42 127.475L42 131.275Z"
                        fill={coverTextColor}/>
                </svg>


                <svg className="book-right" viewBox="0 0 59 449" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" width="100%" height="100%" fill="white"/>
                    <line x1="0.5" y1="449" x2="0.49998" y2="2.18557e-08" stroke="black"/>
                    <line x1="9.5" y1="449" x2="9.49998" y2="2.18557e-08" stroke="black"/>
                    <line x1="36.5" y1="449" x2="36.5" y2="2.18557e-08" stroke="black"/>
                    <line x1="18.5" y1="449" x2="18.5" y2="2.18557e-08" stroke="black"/>
                    <line x1="45.5" y1="449" x2="45.5" y2="2.18557e-08" stroke="black"/>
                    <line x1="27.5" y1="449" x2="27.5" y2="2.18557e-08" stroke="black"/>
                    <line x1="54.5" y1="449" x2="54.5" y2="2.18557e-08" stroke="black"/>
                </svg>
                <svg className="book-bottom" viewBox="0 0 281 59" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>
                    <line x1="2.53526e-06" y1="0.5" x2="281" y2="0.5" stroke="black"/>
                    <line x1="2.53526e-06" y1="9.5" x2="281" y2="9.5" stroke="black"/>
                    <line x1="2.53526e-06" y1="36.5" x2="281" y2="36.5" stroke="black"/>
                    <line x1="2.53526e-06" y1="18.5" x2="281" y2="18.5" stroke="black"/>
                    <line x1="2.53526e-06" y1="45.5" x2="281" y2="45.5" stroke="black"/>
                    <line x1="2.53526e-06" y1="27.5" x2="281" y2="27.5" stroke="black"/>
                    <line x1="2.53526e-06" y1="54.5" x2="281" y2="54.5" stroke="black"/>
                </svg>
                <svg className="book-top" viewBox="0 0 281 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>
                    <line x1="2.53526e-06" y1="0.5" x2="281" y2="0.5" stroke="black"/>
                    <line x1="2.53526e-06" y1="9.5" x2="281" y2="9.5" stroke="black"/>
                    <line x1="2.53526e-06" y1="36.5" x2="281" y2="36.5" stroke="black"/>
                    <line x1="2.53526e-06" y1="18.5" x2="281" y2="18.5" stroke="black"/>
                    <line x1="2.53526e-06" y1="45.5" x2="281" y2="45.5" stroke="black"/>
                    <line x1="2.53526e-06" y1="27.5" x2="281" y2="27.5" stroke="black"/>
                    <line x1="2.53526e-06" y1="54.5" x2="281" y2="54.5" stroke="black"/>
                </svg>
            </div>
            <h4>→ Read</h4>
        </Link>

    </div>);
};

export default MostReadBook;
