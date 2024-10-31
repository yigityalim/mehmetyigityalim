"use client";

import { Incident } from "@/components/incident";
import { mockIncidents } from "@/mocks/incident";
import { AnimatePresence, motion } from "framer-motion";
import { subDays, format } from "date-fns";
import { tr } from "date-fns/locale";

export function IncidentList() {
  const days = Array.from({ length: 16 }, (_, index) =>
    subDays(new Date(), index),
  );

  return (
    <AnimatePresence>
      {days.map((day, index) => {
        const filteredIncidents = mockIncidents.filter((incident) =>
          isSameDay(new Date(incident.created_at), day),
        );

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full py-4"
          >
            <div className="pb-2 border-b border-brand w-full inline-flex items-center justify-start mb-4">
              <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
                {format(day, "dd MMM, yyyy", { locale: tr })}
              </h1>
            </div>
            {filteredIncidents.length > 0 ? (
              filteredIncidents.map((incident) => (
                <Incident key={incident.id} incident={incident} />
              ))
            ) : (
              <p className="text-gray-500/50 dark:text-gray-500 text-xs">
                Bugüne ait bir şey yok
              </p>
            )}
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
