import { Path } from "react-hook-form";

export interface SelectOption<T = any> {
  id: string;
  displayValue: string;
  value: string;
  _?: T;
  disabled?: boolean;
}

export interface SelectProps<Data> {
  data: Data[] | [];
  displayValueKey: Path<Data>;
  valueKey?: Path<Data>;
  className?: string;
  onChange?: (value: Data | undefined) => void;
}
