"use client";

import React from "react";
import { Incident } from "@/components/incident";
import { AnimatePresence, motion } from "framer-motion";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { tr } from "date-fns/locale";
import { useStore } from "@/store";
import { mockIncidents } from "@/mocks/incident";

export function HistoryList() {
  const currentMonth = useStore((state) => state.currentMonth);
  const incidents = React.useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return mockIncidents.filter((incident) => {
      const createdAt = new Date(incident.created_at);
      return createdAt >= start && createdAt <= end;
    });
  }, [currentMonth]);

  return (
    <AnimatePresence>
      {incidents.length > 0 ? (
        incidents.map((incident) => (
          <motion.div
            key={incident.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full py-4"
          >
            <div className="pb-2 border-b border-brand w-full inline-flex items-center justify-start mb-4">
              <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
                {format(new Date(incident.created_at), "dd MMM, yyyy", {
                  locale: tr,
                })}
              </h1>
            </div>
            <Incident key={incident.id} incident={incident} />
          </motion.div>
        ))
      ) : (
        <h1 className="flex-1 h-full text-xl w-full text-start font-semibold text-zinc-800 py-4 dark:text-zinc-200">
          Geçmiş olay bulunamadı.
        </h1>
      )}
    </AnimatePresence>
  );
}
