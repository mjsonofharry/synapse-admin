import React from "react";
import { classnames } from "tailwindcss-classnames";

export default function Tooltip(props: {
  show: boolean;
  text: string;
}): JSX.Element {
  return (
    <span
      hidden={!props.show}
      className={classnames(
        "z-10",
        "px-1",
        "rounded-md",
        "fixed",
        "bg-gray-500",
        "bg-opacity-80",
        "-translate-y-8",
        "-translate-x-1/4"
      )}
    >
      {props.text}
    </span>
  );
}
