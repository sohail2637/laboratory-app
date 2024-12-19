import { useCallback } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const useDownloadReport = () => {
    const downloadReport = useCallback(async (ref, fileName = "patient-report.pdf") => {
        const pdf = new jsPDF("p", "mm", "a4");
        const pages = ref.querySelectorAll(".page");

        const promises = Array.from(pages).map((page, index) =>
            html2canvas(page, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                if (index > 0) pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            })
        );

        await Promise.all(promises);
        pdf.save(fileName);
    }, []);

    return downloadReport;
};

export default useDownloadReport;
