import React, {useState, useRef, useEffect} from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import './css/pdf.css';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import Logo from "../component/logo.jsx";
import LogoContainer from "../component/navbar/logoContainer.jsx";
import ChangeThemeContainer from "../component/navbar/changeThemeContainer.jsx";
import {API_URL} from "../config/api.js";
import {useParams} from "react-router-dom";
import alert from "../config/utils.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const Pdf = () => {
    const {bookId} = useParams()
    console.log(bookId)
    const [pdfDoc, setPdfDoc] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [scale, setScale] = useState(1.5);
    const canvasRef = useRef(null);

    const [controllerActive, setControllerActive] = useState(false);


    const renderPage = async (num) => {
        if (!pdfDoc) return;

        const page = await pdfDoc.getPage(num);
        const viewport = page.getViewport({scale});
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;


        await page.render({canvasContext: ctx, viewport}).promise;


        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        let currentTheme = false;
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            if (storedTheme === "light") {
                currentTheme = true;
            } else {
                currentTheme = false;
            }
        } else {
            const prefers = window.matchMedia("(prefers-color-scheme: light)");
            if (prefers.matches) {
                currentTheme = true;
            } else {
                currentTheme = false;
            }
        }

        if (currentTheme) return;
        for (let i = 0; i < data.length; i += 4) {

            const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            data[i] = data[i + 1] = data[i + 2] = avg;


            data[i] = 255 - data[i];       // R
            data[i + 1] = 255 - data[i + 1];   // G
            data[i + 2] = 255 - data[i + 2];   // B
        }

        ctx.putImageData(imgData, 0, 0);
    };
    useEffect(() => {
        const loadPdf = async () => {
            const token = localStorage.getItem("token") || null;
            try {

                const res = await fetch(`${API_URL}/books/book/pdf/${bookId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    alert("Failed to fetch PDF")
                }



                const blob = await res.blob();
                const buffer = await blob.arrayBuffer();
                const typedArray = new Uint8Array(buffer);


                const loadingTask = pdfjsLib.getDocument(typedArray);
                const pdf = await loadingTask.promise;


                setPdfDoc(pdf);
                setTotalPages(pdf.numPages);
                setPageNum(1);

            } catch (err) {
                console.error("Error loading PDF:", err);
                alert("Failed to load PDF");
            }
        };

        loadPdf();
    }, [bookId]); // 当 bookId 或 token 变化时重新加载


    // const handleFile = (e) => {
    //     fetch(`${API_URL}/books/book/pdf/test.pdf`)
    //         .then(res => res.blob())
    //         .then(blob => {
    //             const reader = new FileReader();
    //             reader.onload = async (event) => {
    //                 try {
    //                     const typedArray = new Uint8Array(event.target.result);
    //                     const loadingTask = pdfjsLib.getDocument(typedArray);
    //                     const pdf = await loadingTask.promise;
    //                     setPdfDoc(pdf);
    //                     setTotalPages(pdf.numPages);
    //                     setPageNum(1);
    //                 } catch (err) {
    //                     console.error('Error loading PDF:', err);
    //                     alert('Failed to load PDF');
    //                 }
    //             };
    //             reader.readAsArrayBuffer(blob);
    //         });
    //     const file = e.target.files[0];
    //     if (!file || file.type !== 'application/pdf') {
    //         alert('Please select a valid PDF file');
    //         return;
    //     }
    //
    //     const reader = new FileReader();
    //     reader.onload = async (event) => {
    //         try {
    //             const typedArray = new Uint8Array(event.target.result);
    //             const loadingTask = pdfjsLib.getDocument(typedArray);
    //             const pdf = await loadingTask.promise;
    //             setPdfDoc(pdf);
    //             setTotalPages(pdf.numPages);
    //             setPageNum(1);
    //         } catch (err) {
    //             console.error('Error loading PDF:', err);
    //             alert('Failed to load PDF');
    //         }
    //     };
    //     reader.readAsArrayBuffer(file);
    // };


    const goPrevPage = () => setPageNum((p) => Math.max(p - 1, 1));
    const goNextPage = () => setPageNum((p) => Math.min(p + 1, totalPages));


    const zoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
    const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));

    useEffect(() => {
        if (pdfDoc) renderPage(pageNum);
    }, [pdfDoc, pageNum, scale]);
    useEffect(() => {
        const handleWheel = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                if (e.deltaY < 0) {
                    zoomIn();
                } else {
                    zoomOut();
                }
            }
        };

        window.addEventListener("wheel", handleWheel, {passive: false});

        return () => {
            window.removeEventListener("wheel", handleWheel);
        };
    }, []);


    return (<div className="pdf-viewer">
        <div className="pdf-header">
            <div className="pdf-navbar">


                <LogoContainer text="ibroGeek"></LogoContainer>

                <div className={"pdf-nav-right"}>
                    {/*<input type="file" accept="application/pdf" onChange={handleFile}/>*/}
                    <div className="page-controls">
                        <button onClick={goPrevPage} disabled={pageNum <= 1}>

                            <svg viewBox="0 0 517 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M25 25V425M491.667 425V25L158.333 225L380.556 358.333"
                                      stroke="var(--text-color)"
                                      strokeWidth="50" strokeLinecap="round" strokeLinejoin="round"/>
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

                            <svg viewBox="0 0 517 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M491.667 25V425M25 425V25L358.333 225L136.111 358.333"
                                      stroke="var(--text-color)"
                                      strokeWidth="50" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>

                        </button>
                    </div>

                    <ChangeThemeContainer></ChangeThemeContainer>
                </div>
            </div>

        </div>

        {pdfDoc && (<div
            className="controls-container"
            onMouseEnter={() => setControllerActive(true)}
            onMouseLeave={() => setControllerActive(false)}
        >
            <div className={`controls ${controllerActive ? "active" : ""}`}>
                {/*<div className="page-controls">*/}
                {/*    <button onClick={goPrevPage} disabled={pageNum <= 1}>*/}

                {/*        <svg viewBox="0 0 517 450" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                {/*            <path d="M25 25V425M491.667 425V25L158.333 225L380.556 358.333" stroke="var(--text-color)"*/}
                {/*                  strokeWidth="50" strokeLinecap="round" strokeLinejoin="round"/>*/}
                {/*        </svg>*/}

                {/*    </button>*/}
                {/*    <span>*/}
                {/*                <input type="number" value={pageNum}/>/ {totalPages}*/}
                {/*            </span>*/}
                {/*    <button onClick={goNextPage} disabled={pageNum >= totalPages}>*/}

                {/*        <svg viewBox="0 0 517 450" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                {/*            <path d="M491.667 25V425M25 425V25L358.333 225L136.111 358.333" stroke="var(--text-color)"*/}
                {/*                  strokeWidth="50" strokeLinecap="round" strokeLinejoin="round"/>*/}
                {/*        </svg>*/}

                {/*    </button>*/}
                {/*</div>*/}

                <div className="zoom-controls">
                    <button onClick={zoomOut}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M20 20L14.9497 14.9498M14.9497 14.9498C16.2165 13.683 17 11.933 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17C11.933 17 13.683 16.2165 14.9497 14.9498ZM7 10H13"
                                stroke="var(--text-color)" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <span>{Math.round(scale * 100)}%</span>
                    <button onClick={zoomIn}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M20 20L14.9497 14.9497M14.9497 14.9497C16.2165 13.683 17 11.933 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17C11.933 17 13.683 16.2165 14.9497 14.9497ZM7 10H13M10 7V13"
                                stroke="var(--text-color)" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>)}

        <div className="pdf-container">
            <canvas ref={canvasRef}></canvas>
        </div>
    </div>);
};

export default Pdf;
