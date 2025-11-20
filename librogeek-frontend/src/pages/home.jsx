import HeroSection from "../component/home/heroSection/heroSection.jsx";
import IntroSection from "../component/home/introSection/introSection.jsx";
import "./css/home.css"
import MostReadSection from "../component/home/mostReadSection/mostReadSection.jsx";
import CategorySection from "../component/home/categorieSection/categorySection.jsx";
import CanvasSection from "../component/home/canvasSection/canvasSection.jsx";
import HomeSectionLinks from "../component/home/homeSectionLinks.jsx";
import {API_URL} from "../config/api.js";

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



export default Home;