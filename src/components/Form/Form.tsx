// client
"use client";

import type React from "react";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
} from "react";
import {
  useForm as useReactHookForm,
  FieldValues,
  UseFormProps as useReactHookFormProps,
  Path,
} from "react-hook-form";
import { ZodEffects, ZodObject, ZodRawShape, ZodTypeAny } from "zod";

import { z } from "../../utils/zod";

import { atom, Provider, useAtom } from "jotai";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldProps, OdinInternal_Field } from "./Field";
import { StepContext, useSteps } from "../../hooks/useSteps";

type UseFormProps<Fields extends FieldValues> = Omit<
  useReactHookFormProps<Fields>,
  "resolver"
> & {
  id?: string;
  fieldOptions?: {
    enableAsterisk?: boolean;
  };
  schema:
    | ZodObject<ZodRawShape, "strip", ZodTypeAny, Fields, Fields>
    | ZodEffects<ZodObject<ZodRawShape, "strip", ZodTypeAny, Fields, Fields>>;
};

export type FormProps<Fields extends FieldValues> = Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "id" | "ref"
> & {
  innerRef?: React.RefObject<HTMLFormElement>;
  hform: UseFormReturn<Fields>;
  onSubmit?: (data: Fields) => void;
};

export type FormGroupChildrenProps = {
  hasNextStep: boolean;
  hasPrevStep: boolean;
  currentStep: number;
  walk: StepContext["walk"];
  dryWalk: StepContext["dryWalk"];
  form: ReactNode;
};

export type FormGroupProps = {
  forms: ReactNode[];
  children: (props: FormGroupChildrenProps) => ReactNode;
};

export type UseFormReturn<Fields extends FieldValues = FieldValues> =
  ReturnType<typeof useForm<Fields>>;

const FormContext = createContext<UseFormReturn>(null!);

export function useForm<F extends FieldValues>({
  schema,
  fieldOptions,
  ...useReactHookFormProps
}: UseFormProps<F>) {
  type Fields = F | z.infer<typeof schema>;

  const id = useId();

  const hookform = useReactHookForm<Fields>({
    ...useReactHookFormProps,
    resolver: zodResolver(schema as any),
  });

  const createField = () => (props: FieldProps<Fields>) => (
    <OdinInternal_Field {...fieldOptions} {...props} />
  );

  const form = {
    id: useReactHookFormProps.id ?? id,
    schema,
    createField,
    ...hookform,
  };

  const [formGroup, setFormGroup] = useAtom(FormGroupAtom);

  useEffect(() => {
    setFormGroup([...formGroup, form]);
  }, []);

  return form;
}

export function useFormContext<Fields extends FieldValues>() {
  return useContext(FormContext) as unknown as UseFormReturn<Fields>;
}

export function FormProvider<Fields extends FieldValues>({
  children,
  ...data
}: UseFormReturn<Fields> & { children: React.ReactNode }) {
  return (
    <FormContext.Provider value={data as unknown as UseFormReturn}>
      {children}
    </FormContext.Provider>
  );
}

export const FormGroupAtom = atom<UseFormReturn[]>([]);

export function FormGroup({ forms, children }: FormGroupProps) {
  const { currentStep, getNextStep, getPrevStep, walk, dryWalk } = useSteps({
    currentStep: 0,
    stepCount: forms.length,
  });

  const hasNextStep = getNextStep() === currentStep + 1;

  const hasPrevStep = getPrevStep() === currentStep - 1;

  return (
    <Provider>
      {children({
        hasNextStep,
        hasPrevStep,
        currentStep,
        walk,
        dryWalk,
        form: forms[currentStep],
      })}
    </Provider>
  );
}

export function Form<Fields extends FieldValues>({
  onSubmit,
  hform,
  innerRef,
  ...props
}: FormProps<Fields>) {
  return (
    <FormProvider {...hform}>
      <form
        onSubmit={
          onSubmit &&
          hform?.handleSubmit((data) => {
            hform.trigger();
            return onSubmit(data);
          })
        }
        ref={innerRef}
        id={hform.id}
        {...props}
      />
    </FormProvider>
  );
}
