import { XCircleIcon } from "@heroicons/react/solid";
import React, { useEffect } from "react";
import { classnames } from "tailwindcss-classnames";
import { IconButton } from "./Button";

export default function Modal(props: {
  title?: string;
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
      onClick={props.hide}
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
        "justify-center",
        "backdrop-blur-md"
      )}
    >
      <article
        onClick={(event) => event.stopPropagation()}
        className={classnames(
          "w-1/3",
          "h-3/4",
          "bg-gray-50",
          "rounded-lg",
          "shadow-md",
          "flex",
          "flex-col",
          "pt-1",
          "px-4",
          "pb-4"
        )}
      >
        <header className={classnames("flex", "w-full")}>
          <span className={classnames("text-lg", "font-semibold", "mt-1")}>
            {props.title}
          </span>
          <IconButton
            type="delete"
            icon={XCircleIcon}
            onClick={props.hide}
            className={classnames("w-8", "h-8", "ml-auto", "inline")}
          />
        </header>
        {props.children}
      </article>
    </div>
  );
}
