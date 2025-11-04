import HeroSection from "../component/home/heroSection/heroSection.jsx";
import IntroSection from "../component/home/introSection/introSection.jsx";
import "./home.css"
import MostReadSection from "../component/home/mostReadSection/mostReadSection.jsx";
import CategorySection from "../component/home/categorieSection/categorySection.jsx";
import CanvasSection from "../component/home/canvasSection/canvasSection.jsx";

const Home = () => {
    return (
        <div>

            <HeroSection></HeroSection>
            <IntroSection></IntroSection>
            <MostReadSection></MostReadSection>
            <CategorySection></CategorySection>
            {/*<CanvasSection></CanvasSection>*/}
        </div>
    );
};

export default Home;