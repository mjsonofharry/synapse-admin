import React from "react";
import { classnames, TTailwindString } from "tailwindcss-classnames";

type ButtonType = "confirm" | "cancel" | "delete" | "create";

type IconProps = (props: React.ComponentProps<"svg">) => JSX.Element;

interface ButtonStyle {
  text: TTailwindString;
  background: TTailwindString;
  icon: TTailwindString;
}

const styles: Record<ButtonType, ButtonStyle> = {
  confirm: {
    text: classnames("text-blue-50"),
    background: classnames("bg-blue-600", "hover:bg-blue-500"),
    icon: classnames("text-blue-500", "hover:text-blue-400"),
  },
  cancel: {
    text: classnames("text-gray-50"),
    background: classnames("bg-gray-500", "hover:bg-gray-400"),
    icon: classnames("text-gray-400", "hover:text-gray-300"),
  },
  delete: {
    text: classnames("text-red-50"),
    background: classnames("bg-red-600", "hover:bg-red-500"),
    icon: classnames("text-red-500", "hover:text-red-400"),
  },
  create: {
    text: classnames("text-green-50"),
    background: classnames("bg-green-600", "hover:bg-green-500"),
    icon: classnames("text-green-500", "hover:text-green-400"),
  },
};

export function SubmitButton(props: {
  disabled?: boolean;
  className?: TTailwindString;
}): JSX.Element {
  return (
    <input
      className={classnames(
        styles["confirm"]["text"],
        styles["confirm"]["background"],
        "cursor-pointer",
        "py-1",
        "px-3",
        "font-medium",
        "rounded-md",
        props.className
      )}
      type="submit"
      value="Submit"
      disabled={props.disabled || false}
    />
  );
}

export function IconButton(props: {
  type: ButtonType;
  icon: IconProps;
  disabled?: boolean;
  className?: TTailwindString;
  onClick: () => void;
  title?: string;
}) {
  return React.createElement(props.icon, {
    className: classnames(
      styles[props.type]["icon"],
      "cursor-pointer",
      "w-5",
      "h-5",
      props.className
    ),
    onClick: props.onClick,
  });
}

export function LabelledButton(props: {
  type: ButtonType;
  label: string;
  disabled?: boolean;
  className?: TTailwindString;
  onClick: () => void;
}) {
  return (
    <button
      className={classnames(
        styles[props.type]["text"],
        styles[props.type]["background"],
        "cursor-pointer",
        "py-1",
        "px-3",
        "font-medium",
        "rounded-md",
        props.className
      )}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}
