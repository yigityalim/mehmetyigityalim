"use client";

import { motion } from "framer-motion";
import type React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function Container({
  title,
  description,
  children,
}: Readonly<ContainerProps>) {
  return (
    <div className="pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
      <div className="relative max-w-lg mx-auto lg:max-w-7xl">
        <div className="w-full min-h-full flex flex-col gap-4 items-center justify-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
            }}
            transition={{ duration: 0.5 }}
            className="my-12 font-black text-center text-[70px] md:text-[170px] leading-none"
          >
            {title}
          </motion.h1>

          <h3 className="font-bold text-center font-mono text-[40px] md:text-[50px] mb-2 text-stroke leading-none tracking-widest">
            {description}
          </h3>
        </div>
        <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-start gap-4">
          {children}
        </main>
      </div>
    </div>
  );
}
