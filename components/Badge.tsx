import React from "react";

type BadgeProps = {
  color: string;
  text: string;
};

const Badge = ({ color, text }: BadgeProps) => {
  const colorClasses: { [key: string]: string } = {
    red: "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20",
    green:
      "bg-green-50 text-green-700 ring-green-600/10 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20",
    blue: "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20",
    yellow:
      "bg-yellow-50 text-yellow-700 ring-yellow-600/10 dark:bg-yellow-400/10 dark:text-yellow-400 dark:ring-yellow-400/20",
    purple:
      "bg-purple-50 text-purple-700 ring-purple-600/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/20",
    cyan: "bg-cyan-50 text-cyan-700 ring-cyan-600/10 dark:bg-cyan-400/10 dark:text-cyan-400 dark:ring-cyan-400/20",
    magenta:
      "bg-pink-50 text-pink-700 ring-pink-600/10 dark:bg-pink-400/10 dark:text-pink-400 dark:ring-pink-400/20",
  };

  const baseClasses =
    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset";

  const colorClass = colorClasses[color] || "";

  return <span className={`${baseClasses} ${colorClass}`}>{text}</span>;
};

export default Badge;
