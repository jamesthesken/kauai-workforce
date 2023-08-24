/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

export default function Contact() {
  const form = useRef();
  const [sending, setSending] = useState(false);

  const sendEmail = (e) => {
    setSending(true);
    e.preventDefault();
    console.log(process.env.FORM_ID);

    emailjs
      .sendForm(
        process.env.SERVICE_ID,
        "contact_form",
        form.current,
        process.env.FORM_ID
      )
      .then(
        (result) => {
          setSending(false);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  return (
    <div id="contact" className="relative bg-transparent">
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-transparent" />
      </div>
      <div className="relative mx-auto max-w-7xl lg:grid lg:grid-cols-5">
        <div className="bg-transparent py-16 px-4 sm:px-6 lg:col-span-2 lg:px-8 lg:py-24 xl:pr-12">
          <div className="mx-auto max-w-lg">
            <h2 className="text-2xl font-bold tracking-tight text-gray-50 sm:text-3xl">
              Get in touch
            </h2>
            <p className="mt-3 text-lg leading-6 text-gray-300">
              Have questions, want to see more data, or have any requests?
              Please reach out.
            </p>
            <dl className="mt-8 text-base text-gray-300">
              <div className="mt-3">
                <dt className="sr-only">Email</dt>
                <dd className="flex">
                  <EnvelopeIcon
                    className="h-6 w-6 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="ml-3">info@kauaitechgroup.com</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="bg-transparent py-16 px-4 sm:px-6 lg:col-span-3 lg:py-24 lg:px-8 xl:pl-12">
          <div className="mx-auto max-w-lg lg:max-w-none">
            <form
              ref={form}
              onSubmit={sendEmail}
              className="grid grid-cols-1 gap-y-6"
            >
              <div>
                <label name="user_name" htmlFor="full-name" className="sr-only">
                  Full name
                </label>
                <input
                  type="text"
                  name="user_name"
                  id="full-name"
                  autoComplete="name"
                  className="block bg-transparent w-full rounded-md border-gray-500 py-3 px-4 placeholder-gray-200 text-gray-100 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label name="user_email" htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="user_email"
                  type="email"
                  autoComplete="email"
                  className="bg-transparent block w-full rounded-md border-gray-500 py-3 px-4 placeholder-gray-200 text-gray-100 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Email"
                />
              </div>
              <div>
                <label htmlFor="phone" className="sr-only">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  autoComplete="tel"
                  className="block bg-transparent w-full rounded-md border-gray-500 py-3 px-4 placeholder-gray-200 text-gray-100 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Phone"
                />
              </div>
              <div>
                <label name="message" htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="block bg-transparent w-full rounded-md border-gray-500 py-3 px-4 placeholder-gray-200 text-gray-100  focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Message"
                  defaultValue={""}
                />
              </div>
              <div>
                {sending ? (
                  <button
                    type="submit"
                    className="disabled inline-flex justify-center rounded-md border border-transparent bg-indigo-600  py-3 px-6 text-base font-medium text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <svg
                      class="mr-3 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span class="font-medium"> Sending... </span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-6 text-base font-medium text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
