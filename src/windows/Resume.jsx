// Import WindowControls component to show the close/minimize/maximize buttons
import { WindowControls } from "#components";
// Import WindowWrapper HOC to wrap this component as a window with full window features
import WindowWrapper from "#hoc/WindowWrapper";
// Import Download icon from lucide-react for the download button
import { Download } from "lucide-react";
// Import Document and Page components from react-pdf library for rendering PDF files
import { Document, Page, pdfjs } from "react-pdf";

// Import CSS styling for PDF annotations (markups, highlights, etc)
import "react-pdf/dist/Page/AnnotationLayer.css";
// Import CSS styling for text selection layer in PDF (allows selecting PDF text)
import "react-pdf/dist/Page/TextLayer.css";

// Configure the PDF.js worker - this is required for react-pdf to process PDF files
// The worker handles the heavy lifting of reading and rendering the PDF in the background
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

// Main Resume component that displays the PDF resume
const Resume = () => {
  return (
    <>
      {/* Window header section - contains window controls and download button */}
      <div id="window-header">
        {/* WindowControls shows the red/yellow/green close/minimize/maximize buttons like macOS */}
        <WindowControls target="resume" />
        
        {/* Display the title/filename in the window header */}
        <h2>Resume.pdf</h2>

        {/* Download link that allows users to download the resume PDF file */}
        {/* href points to where the PDF file is stored in public folder */}
        {/* download attribute triggers browser download instead of opening in new tab */}
        <a
          href="files/UmerJamshaid_CV.pdf"
          download
          className="cursor-pointer"
          title="Download Resume"
        >
          {/* Download icon from lucide-react library */}
          <Download className="icon" />
        </a>
      </div>

      {/* Document component - loads and renders the PDF file */}
      {/* file prop specifies the path to the PDF file in public/files/ folder */}
      <Document file="files/UmerJamshaid_CV.pdf">
        {/* Page component - renders a specific page from the PDF */}
        {/* pageNumber={1} means show the 1st page of the PDF */}
        {/* renderTextLayer allows users to select and copy text from the PDF */}
        {/* renderAnnotationLayer shows markups, highlights, comments in the PDF */}
        <Page pageNumber={1} renderTextLayer renderAnnotationLayer />
        
        {/* Show the 2nd page of the resume */}
        <Page pageNumber={2} renderTextLayer renderAnnotationLayer />
      </Document>
    </>
  );
};
// Wrap the Resume component with WindowWrapper HOC
// WindowWrapper(Component, windowKey) creates a draggable window with open/close/focus features
// "resume" is the unique window key that matches the window state in the store
const ResumeWindow = WindowWrapper(Resume, "resume");

// Export the wrapped component so it can be used in the app
export default ResumeWindow;
