// client
"use client";

import type React from "react";
import { ReactNode, useEffect, useId } from "react";
import {
  useForm as useReactHookForm,
  FieldValues,
  UseFormProps as useReactHookFormProps,
} from "react-hook-form";
import { ZodEffects, ZodObject, ZodRawShape, ZodTypeAny } from "zod";
import { z } from "../../utils/zod";
import { atom, Provider, useAtom, useAtomValue } from "jotai";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldProps, OdinInternal_Field } from "./Field";
import { StepContext, useSteps } from "../../hooks/useSteps";

type UseFormProps<Fields extends FieldValues> = Omit<
  useReactHookFormProps<Fields>,
  "resolver"
> & {
  id?: string;
  onSubmit?: (data: Fields) => void;
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
  hform: UseFormReturn;
  Form: JSX.ElementType;
};

export type FormGroupProps = {
  forms: JSX.ElementType[];
  children: (props: FormGroupChildrenProps) => ReactNode;
};

export type UseFormReturn<Fields extends FieldValues = FieldValues> =
  ReturnType<typeof useForm<Fields>>;

const FormGroupAtom = atom();

export function useFormGroup<Fields extends FieldValues>() {
  return useAtom<UseFormReturn<Fields>[]>(FormGroupAtom as any);
}

export function FormGroup({ forms, children }: FormGroupProps) {
  const { currentStep, getNextStep, getPrevStep, walk, dryWalk } = useSteps({
    currentStep: 0,
    stepCount: forms.length,
  });

  const hasNextStep = getNextStep() === currentStep + 1;

  const hasPrevStep = getPrevStep() === currentStep - 1;

  return (
    <Provider>
      {(() => {
        const [formGroup] = useFormGroup();

        const currentForm = formGroup[currentStep]!;

        return children({
          hasNextStep,
          hasPrevStep,
          currentStep,
          walk,
          dryWalk,
          hform: currentForm,
          Form: forms[currentStep]!,
        });
      })()}
    </Provider>
  );
}

const FormAtom = atom();

export function useParentForm<Fields extends FieldValues>() {
  const { form } = useAtomValue<Fields>(FormAtom as any);

  return form;
}

export function useForm<F extends FieldValues>({
  schema,
  fieldOptions,
  onSubmit,
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
    onSubmit,
    ...hookform,
  };

  const [formGroup, setFormGroup] = useFormGroup<F>();

  useEffect(() => {
    if (formGroup) {
      setFormGroup([...formGroup, form]);
    }
  }, []);

  return form;
}

export function Form<Fields extends FieldValues>({
  onSubmit,
  hform,
  innerRef,
  ...props
}: FormProps<Fields>) {
  return (
    <Provider>
      <form
        onSubmit={
          onSubmit &&
          hform?.handleSubmit((data) => {
            hform.trigger();
            return onSubmit ? onSubmit(data) : hform.onSubmit?.(data);
          })
        }
        ref={innerRef}
        id={hform.id}
        {...props}
      />
    </Provider>
  );
}
