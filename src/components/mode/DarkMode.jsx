import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    setDark((prev) => {
      const isDark = !prev;
      document.documentElement.classList.toggle("dark", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
      return isDark;
    });
  };

  return (
    <button
      className="cursor-pointer flex justify-center gap-x-2 text-xs font-medium items-center "
      onClick={toggleDark}
    >
      {dark ? (
        <Sun className=" h-4 lg:h-5 w-4 lg:w-5 rounded text-white" />
      ) : (
        <Moon className=" h-4 lg:h-5 w-4 lg:w-5 rounded text-white" />
      )}
      {dark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
