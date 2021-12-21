import React from "react";
import { classnames } from "tailwindcss-classnames";

export function ContentCard(props: { children: React.ReactNode }): JSX.Element {
  return (
    <main
      className={classnames(
        "w-full",
        "bg-gray-50",
        "m-4",
        "p-4",
        "shadow-md",
        "rounded-md",
        "overflow-hidden"
      )}
    >
      {props.children}
    </main>
  );
}
