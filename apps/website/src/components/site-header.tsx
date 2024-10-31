"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const menuContext = React.createContext({
  isOpen: false,
  toggleOpen: () => {},
});

export function SiteHeader() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <menuContext.Provider
      value={{ isOpen, toggleOpen: () => setIsOpen(!isOpen) }}
    >
      <header className="fixed inset-x-0 top-0 w-full bg-transparent backdrop-blur-md p-4 flex justify-between items-center">
        <h1>My Site</h1>
        <button type="button" onClick={() => setIsOpen(!isOpen)}>
          Open Menu
        </button>
      </header>

      <MobileMenu />
    </menuContext.Provider>
  );
}

function MobileMenu() {
  const { isOpen, toggleOpen } = React.useContext(menuContext);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 h-full bg-white/50 backdrop-blur-md p-4 flex flex-col items-start justify-start z-10 space-y-4"
        >
          <button type="button" onClick={toggleOpen}>
            Close
          </button>
          <nav>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
