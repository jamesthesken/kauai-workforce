import React from "react";

type BadgeProps = {
  color?: string;
  text: string;
};

export default function Badge({ color, text }: BadgeProps) {
  const badgeColor = color
    ? `bg-${color}-400/10   dark:ring-${color}-400/20 ring-${color}-700/10`
    : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10";

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs dark:text-${color}-400 text-${color}-700 font-medium ${badgeColor}`}
    >
      {text}
    </span>
  );
}
