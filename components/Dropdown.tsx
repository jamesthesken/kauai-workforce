import { Fragment, useState } from "react";
import { Menu, Transition, Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Dropdown({ value, onChange }: any) {
  return (
    <Listbox
      value={value}
      as="div"
      className="relative inline-block text-left"
      onChange={onChange}
    >
      <div>
        <Listbox.Button className="inline-flex w-full justify-center rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-500">
          Industry
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Listbox.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Listbox.Options className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Listbox.Option key={"trucking"} value={"trucking"}>
              {({ active }) => (
                <button
                  className={classNames(
                    active ? "bg-gray-600 text-gray-300" : "text-gray-200",
                    "block text-left w-full px-4 py-2 text-sm"
                  )}
                >
                  Trucking Transportation
                </button>
              )}
            </Listbox.Option>
            <Listbox.Option key={"landscape"} value={"landscape"}>
              {({ active }) => (
                <button
                  className={classNames(
                    active ? "bg-gray-600 text-gray-300" : "text-gray-200",
                    "block text-left w-full px-4 py-2 text-sm"
                  )}
                >
                  Landscaping
                </button>
              )}
            </Listbox.Option>
            <Listbox.Option key={"hvac"} value={"hvac"}>
              {({ active }) => (
                <button
                  className={classNames(
                    active ? "bg-gray-600 text-gray-300" : "text-gray-200",
                    "block text-left w-full px-4 py-2 text-sm"
                  )}
                >
                  Plumbing/HVAC
                </button>
              )}
            </Listbox.Option>
            <Listbox.Option key={"automotive"} value={"automotive"}>
              {({ active }) => (
                <button
                  className={classNames(
                    active ? "bg-gray-600 text-gray-300" : "text-gray-200",
                    "block text-left w-full px-4 py-2 text-left text-sm"
                  )}
                >
                  Automotive Repair
                </button>
              )}
            </Listbox.Option>
          </div>
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
}
