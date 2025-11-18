import "./categorySection.css"
import Category from "./category.jsx";
import {useEffect, useState} from "react";
import {API_URL} from "../../../config/api.js";

const CategorySection = () => {
    const[books, setBooks]= useState([]);
    useEffect(() => {
        fetch(`${API_URL}/books/getMostReadCategory`,
            {
                credentials: "include",
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
                    setBooks(data.data)

                } else {

                    console.log("book not in");
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
            });
    }, []);
    return (
        <section className="category-section" id="category-section">
            {books?.map((b, i) => (
                <Category key={i} books={b} />
            ))}

        </section>
    )
}

export default CategorySection;