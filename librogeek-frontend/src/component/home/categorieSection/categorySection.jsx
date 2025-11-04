import "./categorySection.css"
import Category from "./category.jsx";

const CategorySection = () => {
    return (
        <section className="category-section">
            <Category category_tag={"books"}></Category>
            <Category category_tag={"books"}></Category>
        </section>
    )
}

export default CategorySection;