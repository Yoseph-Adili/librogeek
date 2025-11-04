import {Link} from "react-router-dom";
import {useEffect, useRef, useState} from "react";

const CategoryBook = ({book_cover, book_link, book_title, book_intro}) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
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
        return () => observe.disconnect();
    }, []);
    return (
        <div ref={ref} className={`category-book ${visible ? "visible" : ""}`}>
            <Link to={book_link}>
                <img src={book_cover} alt=""/>
            </Link>
            <div className="category-book-info">
                <h2>{book_title}</h2>
                <p>{book_intro}</p>
            </div>
        </div>
    )
}
export default CategoryBook;