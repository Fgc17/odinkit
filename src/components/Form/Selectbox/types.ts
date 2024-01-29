import { Path } from "react-hook-form";

export interface SelectOption<T = any> {
  id: string;
  displayValue: string;
  value: string;
  _?: T;
}

export interface SelectProps<Data> {
  data: Data[] | [];
  children: (item: Data) => React.ReactNode;
  className?: string;
  displayValueKey: Path<Data>;
  valueKey?: Path<Data>;
  onChange?: (value: Data | undefined) => void;
}
