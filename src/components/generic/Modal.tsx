import React, { useEffect } from "react";
import { classnames } from "tailwindcss-classnames";
import { ContentCard } from "./Content";

export default function Modal(props: {
  hide: () => void;
  children: React.ReactNode;
}): JSX.Element {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        props.hide();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  });

  return (
    <div
      onClick={() => props.hide()}
      className={classnames(
        "z-10",
        "absolute",
        "left-0",
        "top-0",
        "w-screen",
        "h-screen",
        "flex",
        "items-center",
        "content-center",
        "justify-center"
      )}
    >
      {props.children}
    </div>
  );
}
