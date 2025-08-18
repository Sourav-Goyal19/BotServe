import "../styles/chatbot.css";
import { useState, useRef, useEffect } from "react";
import { ChevronUp, MessageCircleMore } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="chatbot-container">
      <div
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="chatbot-toggle-button"
      >
        <div className={`chatbot-icon-wrapper ${isOpen ? "rotated" : ""}`}>
          {isOpen ? (
            <ChevronUp className="chatbot-icon" />
          ) : (
            <MessageCircleMore className="chatbot-icon" />
          )}
        </div>
      </div>
      {isOpen && (
        <div ref={popupRef} className="chatbot-popup chatbot-popup-show" />
      )}
    </div>
  );
};

export default Chatbot;
