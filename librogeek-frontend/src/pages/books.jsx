import './books.css'
import CustomizeTitle from "../component/cuntomizeTitle.jsx";
import {useEffect, useState} from "react";
import ListBook from "../component/books/listBook.jsx";

const Books = () => {
    const [categoryTitle, setCategoryTitle] = useState("All")

    const [listBookStyle, setListBookStyle] = useState(false)

    const type_options = ['All', 'PDF', 'E-Book']
    const sort_options = ['All', 'PDF', 'E-Book']

    const list_books = [
        {
            book_link: "/book",
            book_info: "fgdgdf",
            book_title: "Book 1",
            book_cover: "/book-example.png",
        },
        {
            book_link: "/book2",
            book_info: "Another intro Another intro Another intro Another intro Another intro",
            book_title: "Book 2 Another intro Another intro Another",
            book_cover: "/book-example2.png",
        },
        {
            book_link: "/book3",
            book_info: "Third book intro",
            book_title: "Book 3",
            book_cover: "/book-example3.png",
        },
        {
            book_link: "/book3",
            book_info: "Third book intro",
            book_title: "Book 3",
            book_cover: "/book-example3.png",
        },
    ];


    const [fade, setFade] = useState(false);

    const toggleLayout = (trueOrFalse) => {

        setFade(true);

        setTimeout(() => {

            if (trueOrFalse) {
                setListBookStyle(true);

            } else {
                setListBookStyle(false);
            }

        }, 500);

        setTimeout(() => {

            setFade(false);
            localStorage.setItem("listBookStyle", JSON.stringify(trueOrFalse));
        }, 600);
    };
    useEffect(() => {
        const savedLayout = localStorage.getItem("listBookStyle");
        if (savedLayout !== null) {
            setListBookStyle(JSON.parse(savedLayout));

        }
        console.log(savedLayout)
    }, []);
    return (
        <div className={"books-page-container"}>
            <div className="filter-option-container">
                <form style={{'--i': 0}} action="">
                    <input type="text" name="name"/>
                </form>
                <CustomizeTitle title={categoryTitle}></CustomizeTitle>
                <p style={{'--i': 1}}>Category</p>
                <div style={{'--i': 2}} className="type-sections">
                    <p>Type</p>
                    <div className="type-options">

                        {
                            type_options.map((option, index) => (
                                <span key={index} className={option === "All" ? "selected" : ""}>{option}</span>
                            ))
                        }
                    </div>
                </div>
                <div style={{'--i': 3}} className="sort-sections">
                    <p>Sort by</p>
                    <div className="sort-options">

                        {
                            sort_options.map((option, index) => (
                                <span key={index} className={option === "All" ? "selected" : ""}>{option}</span>
                            ))
                        }
                    </div>
                </div>
                <div style={{'--i': 4}} className="list-book-style">


                    <svg onClick={() => toggleLayout(false)}
                         width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="4" fill="var(--text-color)"/>
                        <rect y="7" width="24" height="4" fill="var(--text-color)"/>
                        <rect y="14" width="24" height="4" fill="var(--text-color)"/>
                        <rect y="20" width="24" height="4" fill="var(--text-color)"/>
                    </svg>

                    <svg onClick={() => toggleLayout(true)}
                         width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_22_60)">
                            <path d="M6.4 0H0V6.4H6.4V0Z" fill="var(--text-color)"/>
                            <path d="M6.4 8.7998H0V15.1998H6.4V8.7998Z" fill="var(--text-color)"/>
                            <path d="M6.4 17.6001H0V24.0001H6.4V17.6001Z" fill="var(--text-color)"/>
                            <path d="M15.1998 8.7998H8.7998V15.1998H15.1998V8.7998Z" fill="var(--text-color)"/>
                            <path d="M15.1998 0H8.7998V6.4H15.1998V0Z" fill="var(--text-color)"/>
                            <path d="M23.9996 8.7998H17.5996V15.1998H23.9996V8.7998Z" fill="var(--text-color)"/>
                            <path d="M15.1998 17.6001H8.7998V24.0001H15.1998V17.6001Z" fill="var(--text-color)"/>
                            <path d="M23.9996 0H17.5996V6.4H23.9996V0Z" fill="var(--text-color)"/>
                            <path d="M23.9996 17.6001H17.5996V24.0001H23.9996V17.6001Z" fill="var(--text-color)"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_22_60">
                                <rect width="24" height="24" fill="var(--text-color)"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>

            </div>


            <div className={
                `books-container 
            ${listBookStyle ? "block" : ""}
            `}
                 style={{opacity: fade ? 0 : 1}}

            >
                {
                    list_books.map((option, index) => (
                        <ListBook
                            book_link={option.book_link} book_cover={option.book_cover}
                            book_title={option.book_title} book_info={option.book_info}
                            index={index}
                        >

                        </ListBook>
                    ))
                }
            </div>
        </div>
    );
};

export default Books;