import { useState, useEffect, useRef } from "react";
import "./ChatInput.css";
import Attachment from "./Attachment";
import AttachmentPreview from "./AttachmentPreview";
import RecordingAnimation from "./RecordingAnimation";
import { FiMic, FiSend } from "react-icons/fi";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognition;

export default function ChatInput({ onSendMessage }) {
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [frequencyData, setFrequencyData] = useState(new Uint8Array(0));
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameId = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInputValue((prev) => prev + finalTranscript);
        stopRecording(); // Stop recording as soon as we have a final result
      }
    };

    recognition.onend = () => {
      stopRecording();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      stopRecording();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        recognition.stop();
      }
      stopRecordingAnimation();
    };
  }, []);

  const startRecording = async () => {
    try {
      setInputValue("");
      recognitionRef.current.start();
      setIsRecording(true);

      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source =
        audioContextRef.current.createMediaStreamSource(streamRef.current);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 32;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      const updateAnimation = () => {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        setFrequencyData(new Uint8Array(dataArrayRef.current));
        animationFrameId.current = requestAnimationFrame(updateAnimation);
      };

      updateAnimation();
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  const stopRecordingAnimation = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
    // clear visual data
    setFrequencyData(new Uint8Array(0));
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    stopRecordingAnimation();
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
          disabled={(inputValue || attachments.length > 0) && isRecording}
        >
          {inputValue || attachments.length > 0 ? (
            <FiSend />
          ) : isRecording ? (
            <RecordingAnimation frequencyData={frequencyData} />
          ) : (
            <FiMic />
          )}
        </button>
      </div>
    </div>
  );
}
