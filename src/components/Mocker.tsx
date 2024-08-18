// client
"use client";
/* eslint-disable @next/next/no-img-element */
"use client";
import { Fragment, useEffect, useState } from "react";
import {
  FieldValues,
  UseFormReturn,
  Path,
  useFormContext,
} from "react-hook-form";
import { create } from "zustand";

async function mockData<Fields extends FieldValues>({
  data,
  form,
}: UseMockerProps<Fields>) {
  const _data = await data();

  const formFields = Object.keys(_data);

  for (const field of formFields) {
    const fieldPath = field as Path<Fields>;

    let fieldValue = _data[fieldPath] ?? null;

    if (typeof fieldValue === "function") {
      fieldValue = fieldValue(form.getValues(fieldPath));
    }

    form.setValue(fieldPath, fieldValue as any);
  }

  form.trigger();
}

type MockerData<Fields extends FieldValues> = () =>
  | Partial<Record<Path<Fields>, any>>
  | Promise<Partial<Record<Path<Fields>, any>>>;

type MockerForm<Fields extends FieldValues> = UseFormReturn<Fields>;

interface MockerStore<Fields extends FieldValues = FieldValues> {
  form: MockerForm<Fields>;
  setForm: (form: MockerForm<Fields>) => void;
  data: MockerData<Fields>;
  setData: (data: MockerData<Fields>) => void;
}

const useMockerStore = create<MockerStore>()((set) => ({
  form: null!,
  setForm: (form: UseFormReturn<FieldValues>) => set({ form }),
  data: null!,
  setData: (data: MockerData<FieldValues>) => set({ data }),
}));

export function Mocker() {
  const { form, data } = useMockerStore();

  const handleKeyDown = async (event: KeyboardEvent, form: any, data: any) => {
    if (event.ctrlKey && event.key === "1") {
      await mockData({ form, data });
    }
  };

  useEffect(() => {
    (async () => {
      if (!form || !data) return;
      window.addEventListener(
        "keydown",
        async (e) => await handleKeyDown(e, form, data)
      );
      return () => {
        window.removeEventListener(
          "keydown",
          async (e) => await handleKeyDown(e, form, data)
        );
      };
    })();
  }, [form, data]);

  return <Fragment />;
}

interface UseMockerProps<Fields extends FieldValues> {
  form: MockerForm<Fields>;
  data: MockerData<Fields>;
}

export function useMocker<Fields extends FieldValues>(
  props: UseMockerProps<Fields>
) {
  const mockerStore = useMockerStore();

  useEffect(() => {
    if (!mockerStore.form) {
      mockerStore.setForm(props.form as any);
    }

    if (!mockerStore.data) {
      mockerStore.setData(props.data);
    }
  }, []);

  return mockerStore;
}
