import { FiImage, FiFile } from "react-icons/fi";
import { useRef } from "react";
import "./PlusMenu.css";

export default function PlusMenu({
  showMenu,
  onAnimationEnd,
  onFileSelect,
  onFileSelected,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    onFileSelect(files);
    if (onFileSelected) onFileSelected(); // To close the menu
  };

  const handleImageUploadClick = () => {
    fileInputRef.current.accept = "image/*";
    fileInputRef.current.click();
  };

  const handlePdfUploadClick = () => {
    fileInputRef.current.accept = "application/pdf";
    fileInputRef.current.click();
  };

  return (
    <div
      className={`plus-menu ${showMenu ? "pop-up" : "pop-down"}`}
      onAnimationEnd={onAnimationEnd}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
      />
      <button onClick={handleImageUploadClick}>
        <FiImage /> Upload an Image
      </button>
      <button onClick={handlePdfUploadClick}>
        <FiFile /> Upload a PDF
      </button>
    </div>
  );
}