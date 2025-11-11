import HeroSection from "../component/home/heroSection/heroSection.jsx";
import IntroSection from "../component/home/introSection/introSection.jsx";
import "./css/home.css"
import MostReadSection from "../component/home/mostReadSection/mostReadSection.jsx";
import CategorySection from "../component/home/categorieSection/categorySection.jsx";
import CanvasSection from "../component/home/canvasSection/canvasSection.jsx";
import HomeSectionLinks from "../component/home/homeSectionLinks.jsx";

const Home = () => {
    return (
        <div>
            <HomeSectionLinks></HomeSectionLinks>
            <HeroSection></HeroSection>
            <IntroSection></IntroSection>
            <MostReadSection></MostReadSection>
            <CategorySection></CategorySection>
            {/*<CanvasSection></CanvasSection>*/}
        </div>
    );
};

import { API_URL } from "../config/api";
fetch(`${API_URL}/users`).then(response => response.json()).then(data => console.log(data))
console.log(API_URL)

export default Home;