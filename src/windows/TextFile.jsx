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
  // Support both 'description' (from Finder constants) and 'paragraphs' for flexibility
  const { name, image, subtitle, description = [], paragraphs = description } = textData;

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Window header with controls and title */}
      <div id="window-header" className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Display close/minimize/maximize buttons */}
          <WindowControls target="txtfile" />
          {/* Display the file name in the header */}
          <h2 className="font-semibold">{name}</h2>
        </div>
      </div>

      {/* Main content area - scrollable */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white">
        {/* Optional featured image at the top */}
        {image ? (
          <div className="w-full">
            <img 
              src={image} 
              alt={name}
              className="w-full h-auto rounded"
            />
          </div>
        ) : null}

        {/* Main title - file name as heading */}
        <h1 className="text-3xl font-bold text-gray-900">
          {name}
        </h1>

        {/* Optional subtitle - secondary heading */}
        {subtitle ? (
          <h3 className="text-lg font-semibold text-gray-700">
            {subtitle}
          </h3>
        ) : null}

        {/* Article body - array of paragraphs */}
        {Array.isArray(paragraphs) && paragraphs.length > 0 ? (
          <div className="space-y-3 leading-relaxed text-base text-gray-800">
            {paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        ) : null}
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
