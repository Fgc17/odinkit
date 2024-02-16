import { Path } from "react-hook-form";

export interface SelectOption<T = any> {
  id: string;
  displayValue: string;
  value: string;
  _?: T;
}

export interface SelectProps<Data> {
  data: Data[] | [];
  displayValueKey: Path<Data>;
  valueKey?: Path<Data>;
  className?: string;
  onChange?: (value: Data | undefined) => void;
}
