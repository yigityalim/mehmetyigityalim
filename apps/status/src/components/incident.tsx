"use client";

import React from "react";
import { cn } from "@myy/ui/cn";
import type { DateTime, Incident } from "@/mocks/incident";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@myy/ui/button";

export function Incident({
  incident,
  className,
}: Readonly<{
  incident: Incident;
  className?: string;
}>) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="w-full">
      <div className="w-full flex flex-col items-start justify-between gap-y-4">
        <Link
          href={`/incidents/${incident.id}`}
          className={cn(
            "text-lg font-bold mb-4",
            {
              "text-accent": incident.status === "resolved",
              "text-destructive": incident.status === "closed",
              "text-yellow-500": incident.status === "open",
            },
            className,
          )}
        >
          {incident.title}
        </Link>
      </div>
      {incident.events.length > 3 ? (
        <>
          <div
            className="w-full flex flex-col items-start justify-start gap-2"
            key="events"
          >
            <div className="w-full flex flex-col gap-4">
              {incident.events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="w-full flex flex-col items-start justify-start gap-2"
                >
                  <p className="w-full text-xs whitespace-pre-line">
                    <span className="font-medium text-[0.85rem]">
                      {event.title}
                    </span>
                    <span className="w-1 h-px mx-1 font-bold block" />
                    <span className="text-gray-600 dark:text-gray-50">{event.message}</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-200">
                    {format(new Date(event.created_at), "dd MMM, HH:mm", {
                      locale: tr,
                    })}
                  </p>
                </div>
              ))}{" "}
            </div>
            <AnimatePresence mode="wait">
              {open && (
                <motion.div className="w-full flex flex-col items-start justify-start gap-2">
                  {incident.events.slice(3).map((event) => (
                    <div
                      key={event.id}
                      className="w-full flex flex-col items-start justify-start gap-2"
                    >
                      <p className="w-full text-xs whitespace-pre-line">
                        <span className="font-medium text-[0.85rem]">
                          {event.title}
                        </span>
                        <span className="w-1 h-px mx-1 font-bold block" />
                        <span className="text-gray-600 dark:text-gray-100">{event.message}</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(event.created_at), "dd MMM, HH:mm", {
                          locale: tr,
                        })}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setOpen((prev) => !prev)}
            className="mt-4 w-full text-zinc-700 dark:text-zinc-200 py-1"
          >
            {open
              ? "Daha az göster"
              : `+${incident.events.length - 3} daha fazla`}
          </Button>
        </>
      ) : (
        <div className="w-full flex flex-col items-start justify-start gap-2">
          {incident.events.map((event) => (
            <Container
              key={event.id}
              title={event.title}
              message={event.message}
              date={event.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Container({
  title,
  message,
  date,
}: Readonly<{ title: string; message: string; date: DateTime }>) {
  return (
    <div
      key={title}
      className="w-full flex flex-col items-start justify-start gap-2 border-b border-gray-200 py-2 dark:border-gray-900"
    >
      <p className="w-full text-xs whitespace-pre-line inline-flex items-start justify-start gap-1">
        <span className="font-bold bg-muted px-1 pr-1.5 shadow-md py-0.5 text-[0.85rem] whitespace-nowrap">{title}</span>
        <span className="text-gray-600 dark:text-gray-50">{message}</span>
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-200">
        {format(new Date(date), "dd MMM, HH:mm", {
          locale: tr,
        })}
      </p>
    </div>
  );
}
