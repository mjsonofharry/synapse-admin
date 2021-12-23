import { classnames, TTailwindString } from "tailwindcss-classnames";

type ButtonType = "confirm" | "cancel" | "delete";

export function button(type: ButtonType): TTailwindString {
  const colors = {
    confirm: classnames("bg-blue-600", "hover:bg-blue-500", "text-gray-50"),
    cancel: classnames("bg-gray-400", "hover:bg-gray-300", "text-gray-50"),
    delete: classnames("bg-red-600", "hover:bg-red-500", "text-gray-50"),
  }[type];

  return classnames(
    colors,
    "cursor-pointer",
    "py-1",
    "px-3",
    "font-medium",
    "rounded-md"
  );
}

export function buttonIcon(type: ButtonType) {
  const colors = {
    confirm: classnames("text-blue-500", "hover:text-blue-300"),
    cancel: classnames("text-gray-300", "hover:text-gray-200"),
    delete: classnames("text-red-500", "hover:text-red-300"),
  }[type];

  return classnames(colors, "cursor-pointer", "w-5", "h-5");
}
