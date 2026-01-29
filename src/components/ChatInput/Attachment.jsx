import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./Attachment.css";
import { FaPlus, FaTimes } from "react-icons/fa";
import PlusMenu from "./PlusMenu";

export default function Attachment({ onFileSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const wrapperRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsRendered(true), 0);
    }
  }, [isOpen]);

  const onAnimationEnd = () => {
    if (!isOpen) {
      setIsRendered(false);
    }
  };

  // Effect to handle clicks outside the menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    // Bind the event listener
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div className="attachment-wrapper" ref={wrapperRef}>
      {isRendered && (
        <PlusMenu
          showMenu={isOpen}
          onAnimationEnd={onAnimationEnd}
          onFileSelect={onFileSelect}
          onFileSelected={toggleMenu}
        />
      )}
      <button className="attach-btn" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaPlus />}
      </button>
    </div>
  );
}

Attachment.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
};
