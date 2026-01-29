import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./ChatInput.css";
import Attachment from "./Attachment";
import AttachmentPreview from "./AttachmentPreview";
import { FaMicrophone, FaArrowUp } from "react-icons/fa";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognition;

export default function ChatInput({ onSendMessage }) {
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Set to false for single phrase recognition
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setInputValue(transcript);
    };

    recognition.onend = () => {
      stopRecording();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        alert("Voice input is not allowed. Please check your microphone permissions.");
      }
      stopRecording();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    try {
      setInputValue("");
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  const handleMicClick = () => {
    if (!isSpeechRecognitionSupported) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAttachmentsChange = (newFiles) => {
    setAttachments((prev) => [...prev, ...newFiles]);
  };

  const removeAttachment = (fileToRemove) => {
    setAttachments((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const handleSendMessage = () => {
    if (isRecording) {
      stopRecording();
    }
    if (inputValue.trim() || attachments.length > 0) {
      onSendMessage(inputValue);
      setInputValue("");
      setAttachments([]);
    }
  };

  return (
    <div className="chat-input-wrapper">
      <div className="attachment-previews">
        {attachments.map((file, index) => (
          <AttachmentPreview
            key={index}
            file={file}
            onRemove={() => removeAttachment(file)}
          />
        ))}
      </div>
      <div className="chat-input">
        <Attachment onFileSelect={handleAttachmentsChange} />
        <input
          placeholder="Ask anything"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <button
          className={`icon-button ${isRecording ? "recording" : ""}`}
          onClick={
            inputValue || attachments.length > 0
              ? handleSendMessage
              : handleMicClick
          }
        >
          {inputValue || attachments.length > 0 ? <FaArrowUp /> : <FaMicrophone />}
        </button>
      </div>
    </div>
  );
}

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
};
