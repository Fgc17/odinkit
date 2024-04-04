"use client";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import React, { useState } from "react";

const types = {
  warning: {
    icon: (
      <ExclamationTriangleIcon
        className="h-5 w-5 text-yellow-400"
        aria-hidden="true"
      />
    ),
    "default-title": "Atenção!",
    "bg-color": "bg-yellow-50",
    "title-color": "text-yellow-800",
    "text-color": "text-yellow-700",
  },
  error: {
    icon: <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />,
    "default-title": "Ocorreu um erro!",
    "bg-color": "bg-red-50",
    "title-color": "text-red-800",
    "text-color": "text-red-700",
  },
  success: {
    icon: (
      <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
    ),
    "default-title": "Sucesso!",
    "bg-color": "bg-green-50",
    "title-color": "text-green-800",
    "text-color": "text-green-700",
  },
  info: {
    icon: (
      <InformationCircleIcon
        className="h-5 w-5 text-blue-400"
        aria-hidden="true"
      />
    ),
    "default-title": "Informação!",
    "bg-color": "bg-blue-50",
    "title-color": "text-blue-800",
    "text-color": "text-blue-700",
  },
};

export type AlertType = keyof typeof types;

export function Alertbox(props: {
  type: AlertType;
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  const [show, setShow] = useState(true);
  const type = types[props.type];

  if (!show) return null;

  return (
    <div className={clsx("rounded-md p-4", type["bg-color"], props.className)}>
      <div className="flex">
        <div className="flex-shrink-0">{type.icon}</div>
        <div className="ml-3">
          <h3 className={clsx("text-sm font-medium", type["title-color"])}>
            {props.title || type["default-title"]}
          </h3>
          <div className={clsx("mt-2 text-sm", type["text-color"])}>
            {props.children}
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={() => setShow(false)}
              className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
