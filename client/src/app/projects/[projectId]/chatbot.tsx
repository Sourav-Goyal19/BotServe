import { cn } from "@/lib/utils";
import { ChevronUp, MessageCircleMore } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-7 right-7">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="size-12 p-2 rounded-full bg-primary flex items-center justify-center cursor-pointer relative"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <ChevronUp className="size-6 text-primary-foreground" />
          ) : (
            <MessageCircleMore className="size-6 text-primary-foreground" />
          )}
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={popupRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "h-96 rounded-lg w-72 shadow-lg mb-4 bg-background border border-primary",
                "absolute bottom-12 right-0"
              )}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Chatbot;
