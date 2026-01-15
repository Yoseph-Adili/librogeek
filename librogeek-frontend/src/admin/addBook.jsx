import "./addBook.css"
import {useContext, useState} from "react";
import {UserContext} from "../App.jsx";
import PdfUploader from "./component/addBook/pdfUploader.jsx";
import * as pdfjsLib from "pdfjs-dist";
import alert from "../config/utils.js";
import {API_URL} from "../config/api.js";

const AddBook = () => {
    const [bookOptions, setBookOptions] = useState("PDF");

    const token = localStorage.getItem("token") || null;
    const {loginUser} = useContext(UserContext);
    const [pdfFile, setPdfFile] = useState(null);


    const [image, setImage] = useState(null);
    const [bookTitle, setBookTitle] = useState("");
    const handlePdfChange = async (e) => {
        const file = e.target.files[0];
        setPdfFile(file);
        setBookTitle(
            e.target.files[0].name.replace(/\.pdf$/i, "")
        );
        if (!file || file.type !== "application/pdf") return;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;

        const page = await pdf.getPage(1);
        const scale = 2;
        const viewport = page.getViewport({scale});

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport,
        }).promise;

        const imageUrl = canvas.toDataURL("image/png");
        setImage(imageUrl);
    };

    function addBook(e) {
        e.preventDefault();

        const formData = new FormData(e.target);

        formData.set("price", parseFloat(formData.get("price")));
        formData.append("format", bookOptions);

        if (image) {
            formData.append("cover_image", image); // File
        }

        if (pdfFile) {
            formData.append("book_file", pdfFile); // File
        }

        fetch(`${API_URL}/books/addBook/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("successfully added");
                    window.location.reload();
                } else {
                    alert("failed: " + data.message);
                }
            })
            .catch(err => {
                alert("server error: " + err.message);
            });
    }



    return (
        <div className={"add-book-page-container"}>
            <div className={"book-options"}>
                <span
                    className={`${bookOptions === "PDF" ? "selected" : ""}`}
                    onClick={() => {
                        setBookOptions("PDF")
                    }}>PDF book</span>
                <span
                    className={`${bookOptions === "PHYSICAL" ? "selected" : ""}`}
                    onClick={() => {
                        setBookOptions("PHYSICAL")
                    }}
                >PHYSICAL book</span>
            </div>
            <form id={"add-book-form"}>
                <div className={"book-form-left-part"}>
                    <div className={"book-cover-container"}>


                        {
                            image && (
                                <img src={image} alt="profile"/>
                            )
                        }

                        <input type="file" name={"cover_image"} id={"cover_image"}
                            // onChange={selectPhoto}
                               style={{display: "none"}}
                        />
                        {/*<label htmlFor="cover_image">*/}
                        {/*    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                        {/*        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>*/}
                        {/*        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>*/}
                        {/*        <g id="SVGRepo_iconCarrier">*/}
                        {/*            <path*/}
                        {/*                d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H12M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"*/}
                        {/*                stroke="var(--text-color)" strokeWidth="2" strokeLinecap="round"*/}
                        {/*                strokeLinejoin="round"></path>*/}
                        {/*            <path d="M17.5 21L17.5 15M17.5 15L20 17.5M17.5 15L15 17.5"*/}
                        {/*                  stroke="var(--text-color)"*/}
                        {/*                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>*/}
                        {/*        </g>*/}
                        {/*    </svg>*/}
                        {/*</label>*/}
                        {
                            bookOptions === "PDF"
                                ?
                                <div>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handlePdfChange}
                                        style={{display: "none"}}
                                        name={"pdf_file"} id={"pdf_file"}
                                    />
                                    <label htmlFor="pdf_file">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round"
                                               strokeLinejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path
                                                    d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H12M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
                                                    stroke="var(--text-color)" strokeWidth="2" strokeLinecap="round"
                                                    strokeLinejoin="round"></path>
                                                <path d="M17.5 21L17.5 15M17.5 15L20 17.5M17.5 15L15 17.5"
                                                      stroke="var(--text-color)"
                                                      strokeWidth="2" strokeLinecap="round"
                                                      strokeLinejoin="round"></path>
                                            </g>
                                        </svg>
                                        <span>
                                            {image ? bookTitle : "Upload PDF and Generate Cover Image"}
                                        </span>
                                    </label>
                                </div>
                                : null
                        }

                    </div>
                </div>
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" name={"title"} id={"title"} value={bookTitle}/>
                    <label htmlFor="author">Author</label>
                    <input type="text" name={"author"} id={"author"}/>
                    <label htmlFor="category">Category</label>
                    <input type="text" name={"category"} id={"category"}/>
                    <label htmlFor={"description"}>Description</label>
                    <textarea name="description" id="description" rows="4"></textarea>
                    <label htmlFor="price">Price (€)</label>
                    <input type="number" name={"price"} id={"price"} step="0.01" min="0"/>
                    <button> Add</button>
                </div>
            </form>
        </div>
    )
}
export default AddBook