import {API_URL, STATIC_URL} from "../config/api.js";
import {Link, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../App.jsx";
import alert from "../config/utils.js";
import "./editBook.css";

const EditBook = () => {
    const {bookId} = useParams();
    const token = localStorage.getItem("token") || null;
    const {loginUser} = useContext(UserContext);

    const [book, setBook] = useState({});
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/books/book/${bookId}`, {
            headers: {Authorization: `Bearer ${token}`}
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setBook(data.data);
                    if (data.data.cover_image) {
                        setImage(`${STATIC_URL}/${data.data.cover_image}`);
                    }
                } else {
                    alert(data.message);
                }
            })
            .catch(err => console.error(err));
    }, [bookId, token]);

    function handleChange(e) {
        const {name, value} = e.target;
        setBook(prev => ({...prev, [name]: value}));
    }

    function editBook(e) {
        e.preventDefault();

        if (!loginUser || loginUser.role !== "ADMIN") {
            alert("You must be an admin to edit books.");
            return;
        }

        const body = {
            bookId:  Number(bookId),
            title: book.title,
            author: book.author,
            description: book.description,
            category: book.category,
            bookType: book.book_type,
            price: Number(book.price)
        };
        if (book.book_type!== "PDF" && book.book_type!== "PHYSICAL"){
            alert("Book type must be either 'PDF' or 'PHYSICAL'.");
            return;
        }
        

        fetch(`${API_URL}/books/editBook`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Book updated successfully");
                } else {
                    alert("Failed: " + data.message);
                }
            })
            .catch(err => alert("Server error: " + err.message));
    }


    function selectPhoto(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();

            img.onload = () => {
                const targetRatio = 15 / 24;
                const srcWidth = img.width;
                const srcHeight = img.height;
                const srcRatio = srcWidth / srcHeight;

                let cropWidth, cropHeight, cropX, cropY;

                if (srcRatio > targetRatio) {

                    cropHeight = srcHeight;
                    cropWidth = cropHeight * targetRatio;
                    cropX = (srcWidth - cropWidth) / 2;
                    cropY = 0;
                } else {
                    cropWidth = srcWidth;
                    cropHeight = cropWidth / targetRatio;
                    cropX = 0;
                    cropY = (srcHeight - cropHeight) / 2;
                }

                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = cropWidth;
                canvas.height = cropHeight;

                ctx.drawImage(
                    img,
                    cropX,
                    cropY,
                    cropWidth,
                    cropHeight,
                    0,
                    0,
                    cropWidth,
                    cropHeight
                );

                const imageUrl = canvas.toDataURL("image/png");
                setImage(imageUrl);
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    }
    function dataURLtoFile(dataUrl, filename) {
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }
    async function uploadCroppedPhoto(e) {
        e.preventDefault();
        if (!image) return alert("No cropped image");

        const blob = dataURLtoFile(image, "cover.png");

        const formData = new FormData();

        formData.append("cover_image", blob, "cover.png");

        fetch(`${API_URL}/books/updateCover/${bookId}`, {
            method: "POST",
            headers: {Authorization: `Bearer ${token}`},
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Cover updated successfully");
                    window.location.reload()
                } else {
                    alert("Failed: " + data.message);
                }
            })
            .catch(err => alert("Error: " + err.message));
    }

    return (
        <div className="edit-book-page-container">
            <div className="book-info-container">
                <form className="book-cover edit-cover-container" onSubmit={uploadCroppedPhoto}>
                    {image && <img src={image} alt="cover"/>}

                    <input
                        type="file"
                        accept="image/*"
                        name="cover_image"
                        id="cover_image"
                        onChange={selectPhoto}
                        style={{display: "none"}}
                    />

                    <label htmlFor="cover_image">
                        <svg viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6.75 9C7.85457 9 8.75 8.1046 8.75 7C8.75 5.89543 7.85457 5 6.75 5C5.64543 5 4.75 5.89543 4.75 7C4.75 8.1046 5.64543 9 6.75 9Z"
                                stroke="var(--text-color)" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round"/>
                            <path d="M5.31055 19C10.8805 9.1 15.5105 7.35991 20.7505 13.7899"
                                  stroke="var(--text-color)" strokeWidth="1.5" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                            <path
                                d="M12.03 1H4.75C3.68913 1 2.67172 1.42136 1.92157 2.17151C1.17142 2.92165 0.75 3.93913 0.75 5V15C0.75 16.0609 1.17142 17.0782 1.92157 17.8284C2.67172 18.5785 3.68913 19 4.75 19H16.75C17.8109 19 18.8283 18.5785 19.5784 17.8284C20.3286 17.0782 20.75 16.0609 20.75 15V10"
                                stroke="var(--text-color)" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round"/>
                            <path
                                d="M18.2488 6.84983C16.3199 6.84983 14.75 5.31296 14.75 3.42882C14.75 3.28367 14.81 3.14447 14.9168 3.04183C15.0236 2.9392 15.1685 2.88153 15.3195 2.88153C15.4705 2.88153 15.6154 2.9392 15.7222 3.04183C15.829 3.14447 15.889 3.28367 15.889 3.42882C15.889 4.71229 16.9486 5.75642 18.2463 5.75642C18.5784 5.75642 18.8995 5.68838 19.201 5.55698C19.3371 5.50436 19.4891 5.50421 19.6254 5.55655C19.7616 5.6089 19.8716 5.70972 19.9325 5.83804C19.9934 5.96635 20.0004 6.11227 19.9521 6.24544C19.9039 6.37862 19.8041 6.48878 19.6734 6.55301C19.2242 6.74894 18.7456 6.84983 18.2488 6.84983ZM21.1787 3.97553C21.0278 3.97553 20.8831 3.91793 20.7764 3.8154C20.6697 3.71288 20.6098 3.57382 20.6098 3.42882C20.6098 2.14536 19.5501 1.10123 18.2512 1.10123C17.9399 1.10123 17.6335 1.15989 17.3478 1.2772C17.2106 1.32572 17.0593 1.32172 16.925 1.26603C16.7908 1.21035 16.684 1.10723 16.6266 0.977992C16.5692 0.848756 16.5657 0.703278 16.6168 0.571627C16.6679 0.439975 16.7696 0.332213 16.901 0.270612C17.328 0.0963629 17.7873 0.00697057 18.2512 0.00781843C20.1801 0.00781843 21.75 1.54469 21.75 3.42882C21.749 3.57394 21.6885 3.71281 21.5814 3.81521C21.4744 3.9176 21.3297 3.97522 21.1787 3.97553ZM17.2721 2.05855H16.2943C16.1977 2.0585 16.1027 2.03477 16.0184 1.98961C15.934 1.94444 15.863 1.87934 15.8121 1.80044C15.7613 1.72153 15.7319 1.63159 15.7268 1.53891C15.7217 1.44623 15.7409 1.35381 15.7828 1.27017L16.2711 0.310499C16.3171 0.217573 16.3896 0.139081 16.4801 0.0841253C16.5706 0.0291692 16.6755 0 16.7826 0C16.8897 0 16.9946 0.0291692 17.0851 0.0841253C17.1756 0.139081 17.2481 0.217573 17.2941 0.310499L17.7824 1.27017C17.8253 1.35351 17.8452 1.44599 17.8402 1.53882C17.8353 1.63164 17.8058 1.72171 17.7544 1.80044C17.7038 1.87965 17.6329 1.945 17.5484 1.99021C17.464 2.03541 17.3688 2.05895 17.2721 2.05855ZM19.7052 7H19.6856C19.5889 6.9974 19.4944 6.97102 19.4113 6.92338C19.3282 6.87573 19.2591 6.8084 19.2108 6.72782L18.7224 5.91598C18.6745 5.83553 18.6485 5.7447 18.6471 5.65199C18.6456 5.55928 18.6686 5.46773 18.714 5.3859C18.7594 5.30408 18.8256 5.23466 18.9065 5.18415C18.9874 5.13364 19.0803 5.10368 19.1766 5.09709L20.2838 5.02318C20.5011 5.01028 20.7062 5.11704 20.8161 5.29536C20.8693 5.38413 20.8957 5.48542 20.8922 5.58781C20.8888 5.6902 20.8556 5.78964 20.7966 5.87491L20.1776 6.7595C20.1254 6.83372 20.055 6.89447 19.9726 6.93641C19.8902 6.97834 19.7984 7.00018 19.7052 7Z"
                                fill="var(--text-color)"/>
                        </svg>
                    </label>

                    <button className="edit-cover-button">Edit Cover</button>
                </form>

                <form className="book-info edit-form" onSubmit={editBook}>
                    <p>Title</p>
                    <input type="text" name="title" value={book.title || ""} onChange={handleChange}/>

                    <p>Author</p>
                    <input type="text" name="author" value={book.author || ""} onChange={handleChange}/>

                    <p>Description</p>
                    <textarea name="description" value={book.description || ""} onChange={handleChange} cols="30"
                              rows="10"/>

                    <div style={{"--i": 3}} className="type-container">
                        <div className="type">
                            <p>Category</p>
                            <input type="text" name="category" value={book.category || ""}
                                   onChange={handleChange}/>
                        </div>

                        <div className="type">
                            <p>Type</p>
                            <input type="text" name="book_type" value={book.book_type || ""}
                                   onChange={handleChange}/>
                        </div>
                    </div>

                    <p>Price</p>
                    <div className="buttons-container">
                        <input type="number" name="price" value={book.price ?? ""} onChange={handleChange}/>€
                        <button type="submit" className="save-button">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBook;
