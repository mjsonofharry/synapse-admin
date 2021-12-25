import React from "react";
import { classnames, TTailwindString } from "tailwindcss-classnames";

type ButtonType = "confirm" | "cancel" | "delete" | "create";
type ButtonColor = "blue" | "gray" | "red" | "green";
type ButtonValue = 200 | 300 | 400 | 500 | 600;
type ButtonSize = "small" | "medium" | "large";

type IconProps = (props: React.ComponentProps<"svg">) => JSX.Element;

class Styles {
  private static type2color: Record<ButtonType, ButtonColor> = {
    confirm: "blue",
    cancel: "gray",
    delete: "red",
    create: "green",
  };

  private static type2value(light: boolean): Record<ButtonType, ButtonValue> {
    return {
      confirm: light ? 500 : 600,
      cancel: light ? 300 : 400,
      delete: light ? 500 : 600,
      create: light ? 500 : 600,
    };
  }

  private static type2hoverValue(
    light: boolean
  ): Record<ButtonType, ButtonValue> {
    return {
      confirm: light ? 400 : 500,
      cancel: light ? 200 : 300,
      delete: light ? 400 : 500,
      create: light ? 400 : 500,
    };
  }

  public static colors(args: {
    type: ButtonType;
    style: "background" | "text";
    light: boolean;
  }): TTailwindString {
    const color = Styles.type2color[args.type];
    const value = Styles.type2value(args.light)[args.type];
    const hoverValue = Styles.type2hoverValue(args.light)[args.type];
    if (args.style === "text") {
      return classnames(
        `text-${color}-${value}`,
        `hover:text-${color}-${hoverValue}`
      );
    } else {
      return classnames(
        `bg-${color}-${value}`,
        `hover:bg-${color}-${hoverValue}`
      );
    }
  }

  public static solidTextButton(type: ButtonType): TTailwindString {
    return classnames(
      Styles.colors({ type, style: "background", light: false }),
      "text-gray-50",
      "cursor-pointer",
      "py-1",
      "px-3",
      "font-medium",
      "rounded-md"
    );
  }

  public static textButton(type: ButtonType): TTailwindString {
    return classnames(
      Styles.colors({ type, style: "text", light: false }),
      "cursor-pointer",
      "py-1",
      "px-3",
      "font-medium"
    );
  }

  public static iconButton(type: ButtonType): TTailwindString {
    return classnames(
      Styles.colors({ type, style: "text", light: true }),
      "cursor-pointer",
      "w-5",
      "h-5"
    );
  }
}

export function SubmitButton(props: {
  disabled?: boolean;
  classNames?: TTailwindString;
}): JSX.Element {
  return (
    <input
      className={classnames(
        Styles.solidTextButton("confirm"),
        props.classNames
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
}) {
  return React.createElement(props.icon, {
    className: classnames(Styles.iconButton(props.type), props.className),
    onClick: props.onClick,
  });
}

export function LabelledButton(props: {
  type: ButtonType;
  label: string;
  disabled?: boolean;
  classNames?: TTailwindString;
  onClick: () => void;
}) {
  return (
    <button
      className={classnames(
        Styles.solidTextButton(props.type),
        props.classNames
      )}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}
