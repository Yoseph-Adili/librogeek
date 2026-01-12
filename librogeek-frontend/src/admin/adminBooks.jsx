

import {useEffect, useState} from "react";
import {API_URL, STATIC_URL} from "../config/api.js";
import {Link, useParams} from "react-router-dom";
import CustomizeTitle from "../component/cuntomizeTitle.jsx";
import "./adminBooks.css";
import AdminListBook from "./component/books/AdminListBook.jsx";

const AdminBooks = () => {
    const {category} = useParams();

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 20;
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [categoriesContainer, setCategoriesContainer] = useState(false);
    const [tagsContainer, setTagsContainer] = useState(false);
    const [fade, setFade] = useState(false);
    const [listBookStyle, setListBookStyle] = useState(false);

    const [sortedBy, setSortedBy] = useState("Date");
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedType, setSelectedType] = useState("ALL");
    const [categoryTitle, setCategoryTitle] = useState('All');
    const [searchQuery, setSearchQuery] = useState("");

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [list_books, setListBooks] = useState([]);
    const [type_options, setType_options] = useState(['All', 'PDF', 'Physical']);
    const sort_options = ['Date', 'Downloads', 'Views'];




    useEffect(() => {
        setCategoryTitle(category ? category : "All");
    }, [category]);


    useEffect(() => {
        const savedLayout = localStorage.getItem("listBookStyle");
        if (savedLayout !== null) setListBookStyle(JSON.parse(savedLayout));

        // Categories
        fetch(`${API_URL}/books/getCategories`)
            .then(res => res.json())
            .then(data => setCategories(['All', ...data.data]))
            .catch(err => console.error(err));

        // Tags
        fetch(`${API_URL}/books/tags/getAllTags`)
            .then(res => res.json())
            .then(data => setTags(data.data))
            .catch(err => console.error(err));

        // Types
        fetch(`${API_URL}/books/getAllTypes`)
            .then(res => res.json())
            .then(data => setType_options(['ALL', ...data.data]))
            .catch(err => console.error(err));
    }, []);


    useEffect(() => {
        let url = `${API_URL}/books/all?`;

        if (searchQuery.trim() !== "") {
            url += `search=${encodeURIComponent(searchQuery.trim())}&`;
        }
        if (category && category !== "All") {
            url += `category=${encodeURIComponent(category)}&`;
        }
        if (selectedType && selectedType !== "All") {
            url += `type=${encodeURIComponent(selectedType)}&`;
        }
        if (selectedTags.length > 0) {
            url += `tags=${selectedTags.map(t => encodeURIComponent(t)).join(",")}&`;
        }

        url += `page=${page}&limit=${limit}`;

        setIsLoading(true);
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (page === 1) {
                    setListBooks(data.data.data);
                } else {
                    setListBooks(prev => [...prev, ...data.data.data]);
                }
                setTotal(data.total);
                console.log(data);
                setHasMore(data.data.data.length === limit);

            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));


    }, [page, searchQuery, category, selectedTags, selectedType]);

    useEffect(() => {
        const handleScroll = () => {
            if (isLoading || !hasMore) return;

            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= windowHeight) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isLoading, hasMore]);


    useEffect(() => {
        setPage(1);
        setListBooks([]);
        setHasMore(true);
    }, [searchQuery, category, selectedTags, selectedType]);

    useEffect(() => {
        let sorted = [...list_books];

        switch (sortedBy) {
            case "Downloads":
                sorted.sort((a, b) => b.downloads - a.downloads);
                break;
            case "Views":
                sorted.sort((a, b) => b.views - a.views);
                break;
            case "Date":
                sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            default:
                break;
        }

        setListBooks(sorted);
    }, [sortedBy]);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const toggleLayout = (trueOrFalse) => {
        setFade(true);
        setTimeout(() => setListBookStyle(trueOrFalse), 500);
        setTimeout(() => {
            setFade(false);
            localStorage.setItem("listBookStyle", JSON.stringify(trueOrFalse));
        }, 600);
    };

    return (<div className={"books-page-container"} id={"admin-books-page-container"}>
        <div className={`container-background ${categoriesContainer ? "active" : ""} ${tagsContainer ? "active" : ""}`}>
            <div className={`categories-container ${categoriesContainer ? "active" : ""}`}>
                <div className={"categories-container-close"}
                     onClick={() => {
                         setCategoriesContainer(false);
                     }}
                >
                    ✕
                </div>
                {categories.map((category, index) => (
                    <Link key={index} to={`/admin/books/category/${category}`}>{category}</Link>))}

            </div>
            <div className={`tags-container ${tagsContainer ? "active" : ""}`}>
                <div className={"categories-container-close"}
                     onClick={() => {
                         setTagsContainer(false);
                     }}
                >
                    ✕
                </div>
                {tags.map((tagObj, index) => (
                    <span
                        key={index}
                        onClick={() => toggleTag(tagObj.tag)}
                        className={selectedTags.includes(tagObj.tag) ? "selected" : ""}
                    >
        {tagObj.tag}
    </span>
                ))}


            </div>
        </div>

        <div className="filter-option-container">

            <CustomizeTitle key={categoryTitle} title={categoryTitle}></CustomizeTitle>
            <p style={{'--i': 1}} onClick={() => {
                setCategoriesContainer(true);
            }}
            >Category</p>
            <form style={{'--i': 0}} action="">
                <input type="text" name="name"
                       onChange={(e) => {
                           setSearchQuery(e.target.value)
                       }}/>
            </form>
            <div id={"selected-tags-container"}
                 style={{
                     '--i': 2,
                     marginTop: selectedTags.length === 0 ? '0px' : '2rem',
                 }}>
                {selectedTags.map((selectedTag) => (
                    <span className={"selected-tags"}>
                        <b
                            onClick={() => toggleTag(selectedTag)}
                        >✕</b>
                        {selectedTag}
                    </span>
                ))}
            </div>
            <div className="section-container">
            <div style={{'--i': 2}} className="type-sections">
                <p>Type</p>
                <div className="type-options">

                    {type_options.map((option, index) => (
                        <span
                            key={index}
                            className={option === selectedType ? "selected" : ""}
                            onClick={() => setSelectedType(option)}
                        >
                            {option}
                        </span>
                    ))}
                </div>
            </div>
            <div style={{'--i': 3}} className="sort-sections">
                <p>Sort by</p>
                <div className="sort-options">

                    {sort_options.map((option, index) => (

                        <span key={index} className={option === sortedBy ? "selected" : ""}
                              onClick={() => setSortedBy(option)}
                        >{option}</span>))}
                </div>
            </div>
            </div>
            <div className="section-container">
            <p style={{'--i': 4}} id="tags-sections" onClick={() => {
                setTagsContainer(true)
            }}>Tags</p>


            <div style={{'--i': 5}} className="list-book-style">


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
        </div>


        <div className={`books-container 
            ${listBookStyle ? "block" : ""}
           
            `}
             style={{opacity: fade ? 0 : 1}}

        >
            {list_books.map((option, index) => (
                <AdminListBook
                key={option.book_id + '-' + sortedBy + '-' + index}
                book_id={option.book_id} book_cover={STATIC_URL + "/" + option.cover_image}
                book_title={option.title} book_info={option.description}
                tags={option.tags}
                index={index}
            >

            </AdminListBook>))}
        </div>
    </div>);
};

export default AdminBooks;