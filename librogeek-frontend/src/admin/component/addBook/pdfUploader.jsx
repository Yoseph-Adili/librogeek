import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function PdfUploader({ onImageGenerated }) {

    const handlePdfChange = async (e) => {
        const file = e.target.files[0];
        if (!file || file.type !== "application/pdf") return;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: ctx,
            viewport,
        }).promise;

        const image = canvas.toDataURL("image/png");

        onImageGenerated(image);
    };

    return (
        <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
        />
    );
}

export default PdfUploader;
