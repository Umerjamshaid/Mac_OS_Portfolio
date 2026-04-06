// Import WindowControls component for close/minimize/maximize buttons
import { WindowControls } from "#components";
// Import WindowWrapper HOC for window management and dragging features
import WindowWrapper from "#hoc/WindowWrapper";
// Import useWindowStore to access the txtfile window data
import useWindowStore from "#store/window";

// Main TextFile component that displays text/document content
const TextFile = () => {
  // Access the window store to get txtfile window data
  const { windows } = useWindowStore();
  
  // Get the text file data from the store
  // This data is set when user clicks on a text file from Finder
  const textData = windows.txtfile?.data;

  // Return null if no data available - window is empty
  if (!textData) {
    return null;
  }

  // Destructure the text file data with optional fields
  const { name, image, subtitle, paragraphs = [] } = textData;

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Window header with controls and title */}
      <div id="window-header" className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Display close/minimize/maximize buttons */}
          <WindowControls target="txtfile" />
          {/* Display the file name in the header */}
          <h2 className="font-semibold">{name}</h2>
        </div>
      </div>

      {/* Main content area - scrollable */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* Optional featured image at the top */}
        {image && (
          <div className="mb-6 rounded-lg overflow-hidden shadow-md">
            <img 
              src={image} 
              alt={name}
              className="w-full h-auto object-cover max-h-64"
            />
          </div>
        )}

        {/* Main title - file name as heading */}
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          {name}
        </h1>

        {/* Optional subtitle - secondary heading */}
        {subtitle && (
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            {subtitle}
          </p>
        )}

        {/* Article body - array of paragraphs */}
        <div className="prose dark:prose-invert max-w-none">
          {paragraphs.map((paragraph, index) => (
            <p 
              key={index}
              className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

// Wrap the TextFile component with WindowWrapper HOC
// This adds dragging, resizing, open/close, and focus functionality
// "txtfile" is the unique window key that matches the store
const TextFileWindow = WindowWrapper(TextFile, "txtfile");

// Export the wrapped component
export default TextFileWindow;
