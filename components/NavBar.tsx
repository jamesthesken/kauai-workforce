import { Fragment, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Contact", href: "#contact", current: false },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Disclosure as="nav" className="dark:bg-gray-900 bg-gray-100">
      {({ open }) => (
        <>
          <div className="relative container mx-auto py-6 px-6">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white text-gray-600 hover:text-gray-500 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center"></div>
                <div className="hidden sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "dark:bg-gray-900 bg-gray-100 dark:text-white text-gray-700"
                            : "dark:text-gray-300 text-gray-900 dark:hover:bg-gray-700 hover:text-gray-400",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                    {theme === "dark" ? (
                      <button onClick={() => setTheme("light")}>
                        <MoonIcon className="h-6 w-6 dark:text-gray-100" />
                      </button>
                    ) : (
                      <button onClick={() => setTheme("dark")}>
                        <SunIcon className="h-6 w-6 text-gray-900" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "dark:bg-gray-900 bg-gray-200 dark:text-white text-gray-800"
                      : "text-gray-400 dark:hover:bg-gray-700 hover:bg-gray-200 dark:hover:text-white hover:text-gray-800",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              {theme === "dark" ? (
                <button className="px-3 py-2" onClick={() => setTheme("light")}>
                  <MoonIcon className="h-6 w-6  dark:text-gray-100" />
                </button>
              ) : (
                <button className="px-3 py-2" onClick={() => setTheme("dark")}>
                  <SunIcon className="h-6 w-6  text-gray-900" />
                </button>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
