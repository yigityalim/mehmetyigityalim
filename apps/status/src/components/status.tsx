"use client";
import { cn } from "@myy/ui/cn";
import React from "react";

export type Status = {
  id: string;
  title: string;
  status: "stable" | "danger" | "maintenance" | "development";
  url: string;
};

const mock_status = [
  {
    id: "mehmetyigityalim-com",
    title: "mehmetyigityalim.com",
    status: "maintenance",
    url: "mehmetyigityalim.com",
  },
  {
    id: "api-mehmetyigityalim-com",
    title: "api.mehmetyigityalim.com",
    status: "danger",
    url: "api.mehmetyigityalim.com",
  },
  {
    id: "v2-mehmetyigityalim-com",
    title: "v2.mehmetyigityalim.com",
    status: "development",
    url: "beta.mehmetyigityalim.com",
  },
  {
    id: "nextjs-boilerplate",
    title: "Nextjs Boilerplate",
    status: "stable",
    url: "#",
  },
] satisfies Status[];

export function Status() {
  const status = React.useMemo(
    () => mock_status.every((item) => item.status === "stable"),
    [],
  );

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div
        className={cn(
          "px-4 py-2 shadow-md rounded-md w-full inline-flex items-center justify-start font-semibold uppercase border border-transparent",
          status
            ? "bg-green-500 text-white text-start border-green-600"
            : "bg-red-500 text-white text-center border-red-600",
        )}
      >
        {status ? "Tüm sistemler çalışıyor" : "Sorun var"}
      </div>
      <div className="mt-8 w-full">
        <ul className="rounded-md w-full">
          {mock_status.map((status) => (
            <li
              key={status.id}
              className="py-3 px-4 border-brand text-sm first:rounded-t-md last:rounded-b-md first:border-t border-x border-b"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="font-medium">{status.title}</p>
                </div>
                <span
                  className={cn("text-xs font-bold", {
                    "text-green-500": status.status === "stable",
                    "text-red-500": status.status === "danger",
                    "text-yellow-500": status.status === "maintenance",
                    "text-blue-500": status.status === "development",
                  })}
                >
                  {status.status === "stable" && "Operasyonel"}
                  {status.status === "maintenance" && "Bakım"}
                  {status.status === "danger" && "Hata"}
                  {status.status === "development" && "Geliştirme"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
