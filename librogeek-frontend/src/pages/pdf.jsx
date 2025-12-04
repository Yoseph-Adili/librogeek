import React, {useState, useRef, useEffect, useContext} from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import './css/pdf.css';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import LogoContainer from "../component/navbar/logoContainer.jsx";
import ChangeThemeContainer from "../component/navbar/changeThemeContainer.jsx";
import {API_URL} from "../config/api.js";
import {useParams} from "react-router-dom";
import alert from "../config/utils.js";
import {UserContext} from "../App.jsx";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const Pdf = () => {
    const {bookId} = useParams();
    const [pdfDoc, setPdfDoc] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [scale, setScale] = useState(1.5);
    const canvasRef = useRef(null);
    const [controllerActive, setControllerActive] = useState(false);
    const {loginUser} = useContext(UserContext);

    useEffect(() => {
        if (!loginUser) return;
        const token = localStorage.getItem("token") || null;
        fetch(`${API_URL}/books/book/bookPage/${bookId}`, {
            headers: {Authorization: `Bearer ${token}`}
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) setPageNum(data.data);
            })
            .catch(err => console.error(err));
    }, [loginUser, bookId]);

    function saveCurrentPage(num) {
        if (!loginUser) return;
        const token = localStorage.getItem("token") || null;
        fetch(`${API_URL}/books/book/bookPage/${bookId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({page: num})
        }).catch(err => console.error(err));
    }

    const renderPage = async (num) => {
        if (!pdfDoc) return;
        const page = await pdfDoc.getPage(num);

        const viewport = page.getViewport({
            scale,
        });

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({canvasContext: ctx, viewport}).promise;

        setTimeout(() => {
            page.render({canvasContext: ctx, viewport});
        }, 0);

    };

    useEffect(() => {
        const loadPdf = async () => {
            const token = localStorage.getItem("token") || null;
            try {
                const res = await fetch(`${API_URL}/books/book/pdf/${bookId}`, {
                    headers: {Authorization: `Bearer ${token}`}
                });

                if (!res.ok) alert("Failed to fetch PDF");

                const blob = await res.blob();
                const buffer = await blob.arrayBuffer();
                const typedArray = new Uint8Array(buffer);

                const loadingTask = pdfjsLib.getDocument(typedArray);
                const pdf = await loadingTask.promise;

                setPdfDoc(pdf);
                setTotalPages(pdf.numPages);
            } catch (err) {
                console.error(err);
                alert("Failed to load PDF");
            }
        };

        loadPdf();
    }, [bookId]);

    const goPrevPage = () => {
        setPageNum(p => {
            const newPage = Math.max(p - 1, 1);
            saveCurrentPage(newPage);
            return newPage;
        });
    };

    const goNextPage = () => {
        setPageNum(p => {
            const newPage = Math.min(p + 1, totalPages);
            saveCurrentPage(newPage);
            return newPage;
        });
    };


    const zoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
    const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));

    useEffect(() => {
        if (pdfDoc) renderPage(pageNum);
    }, [pdfDoc, pageNum, scale]);

    useEffect(() => {
        const handleWheel = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                if (e.deltaY < 0) zoomIn();
                else zoomOut();
            }
        };
        window.addEventListener("wheel", handleWheel, {passive: false});
        return () => window.removeEventListener("wheel", handleWheel);
    }, []);

    return (
        <div className="pdf-viewer">
            <div className="pdf-header">
                <div className="pdf-navbar">
                    <LogoContainer text="ibroGeek"></LogoContainer>

                    <div className="pdf-nav-right">
                        <div className="page-controls">
                            <button onClick={goPrevPage} disabled={pageNum <= 1}>
                                <svg viewBox="0 0 517 450" fill="none">
                                    <path d="M25 25V425M491.667 425V25L158.333 225L380.556 358.333"
                                          stroke="var(--text-color)" strokeWidth="50"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>

                            <span>
                                <input
                                    type="number"
                                    value={pageNum}
                                    onChange={(e) => setPageNum(Number(e.target.value))}
                                    min={1}
                                    max={totalPages}
                                />
                                / {totalPages}
                            </span>

                            <button onClick={goNextPage} disabled={pageNum >= totalPages}>
                                <svg viewBox="0 0 517 450" fill="none">
                                    <path d="M491.667 25V425M25 425V25L358.333 225L136.111 358.333"
                                          stroke="var(--text-color)" strokeWidth="50"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        <ChangeThemeContainer></ChangeThemeContainer>
                    </div>
                </div>
            </div>

            {pdfDoc && (
                <div
                    className="controls-container"
                    onMouseEnter={() => setControllerActive(true)}
                    onMouseLeave={() => setControllerActive(false)}
                >
                    <div className={`controls ${controllerActive ? "active" : ""}`}>
                        <div className="zoom-controls">
                            <button onClick={zoomOut}>
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M20 20L14.9497 14.9498M14.9497 14.9498C16.2165 13.683 17 11.933 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17C11.933 17 13.683 16.2165 14.9497 14.9498ZM7 10H13"
                                          stroke="var(--text-color)" strokeWidth="1.5"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>

                            <span>{Math.round(scale * 100)}%</span>

                            <button onClick={zoomIn}>
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M20 20L14.9497 14.9497M14.9497 14.9497C16.2165 13.683 17 11.933 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17C11.933 17 13.683 16.2165 14.9497 14.9497ZM7 10H13M10 7V13"
                                          stroke="var(--text-color)" strokeWidth="1.5"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`pdf-container`}>
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    );
};

export default Pdf;
