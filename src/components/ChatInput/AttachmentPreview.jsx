import { useState, useEffect } from "react";
import { FiX, FiFile } from "react-icons/fi";
import "./AttachmentPreview.css";

export default function AttachmentPreview({ file, onRemove }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  return (
    <div className="attachment-preview">
      {previewUrl ? (
        <img src={previewUrl} alt={file.name} className="image-preview" />
      ) : (
        <div className="file-preview">
          <FiFile size={24} />
          <span className="file-name">{file.name}</span>
        </div>
      )}
      <button onClick={onRemove} className="remove-attachment">
        <FiX size={12} />
      </button>
    </div>
  );
}
