import HeroSection from "../component/home/heroSection/heroSection.jsx";
import IntroSection from "../component/home/introSection/introSection.jsx";
import "./css/home.css"
import MostReadSection from "../component/home/mostReadSection/mostReadSection.jsx";
import CategorySection from "../component/home/categorieSection/categorySection.jsx";
import CanvasSection from "../component/home/canvasSection/canvasSection.jsx";
import HomeSectionLinks from "../component/home/homeSectionLinks.jsx";
import {API_URL} from "../config/api.js";

const Home = () => {
    fetch(`${API_URL}/debug/cover/book-example.png`,
        {
            credentials: "include",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
        .then(async res => {
            console.log("HTTP status:", res.status);
            if (res.ok) return res.json();
            else {
                const errData = await res.json().catch(() => null);
                console.log("Error response:", errData);
                return null;
            }
        })
        .then(data => {
            if (data?.success) {
                console.log("book  in:", data.data);

            } else {

                console.log("book not in");
            }
        })
        .catch(err => {
            console.error("Fetch error:", err);
        });

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