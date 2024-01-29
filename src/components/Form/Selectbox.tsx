// client
"use client";

import {
  Listbox as HeadlessListbox,
  ListboxButton as HeadlessListboxButton,
  ListboxOption as HeadlessListboxOption,
  ListboxOptions as HeadlessListboxOptions,
  ListboxSelectedOption as HeadlessListboxSelectedOption,
  Transition as HeadlessTransition,
  type ListboxOptionProps as HeadlessListboxOptionProps,
  type ListboxProps as HeadlessListboxProps,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption as HeadlessComboboxOption,
  Combobox as HeadlessCombobox,
  type SelectProps as HeadlessSelectProps,
  type ComboboxProps as HeadlessComboboxProps,
  Select as HeadlessSelect,
  ComboboxOptionProps,
} from "@headlessui/react";
import { useFormContext } from "./Form";
import {
  CheckIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import {
  useState,
  useMemo,
  useRef,
  useEffect,
  Fragment,
  useCallback,
} from "react";
import { Path, Controller } from "react-hook-form";
import { For } from "../For";
import { inputClasses } from "./Input";
import { getEntryFromPath } from "./_shared/utils/getEntryFromPath";
import { Span } from "./Span";
import { useField } from "./Field";
import { If } from "../If";

const selectDropdownHeights = {
  1: "max-h-12",
  2: "max-h-20",
  3: "max-h-28",
  4: "max-h-36",
  5: "max-h-44",
  6: "max-h-52",
  7: "max-h-60",
  8: "max-h-68",
  9: "max-h-76",
};
