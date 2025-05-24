import FormInputWrapper from "@/components/common/form/FormInputWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Camera, CroissantIcon } from "lucide-react";
import Image from "next/image";
import { Control, Controller, FieldValues } from "react-hook-form";

// types.ts
export type InputType =
  | "text"
  | "email"
  | "number"
  | "date"
  | "url"
  | "password"
  | "textarea"
  | "checkbox"
  | "radio"
  | "select"
  | "file"
  | "single-checkbox"
  | "multiple-checkbox"
  | "switch";

export type OptionType = {
  label: string;
  value: string;
};

export interface FormInputConfig<Name extends string = string> {
  name: Name;
  label: string;
  type: InputType;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  options?: OptionType[]; // for select and radio
  className?: string;
  inputClassName?: string;
  colSpans?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  visible?: boolean;
  size?: "sm" | "md" | "lg";
  accept?: string; // for file input
}

interface FormInputProps {
  formData: FormInputConfig[];
  control: Control<FieldValues>;
  size?: "sm" | "md" | "lg";
}

export const FormInput = ({ formData, control }: FormInputProps) => {
  const commonInputTypes = ["text", "email", "number", "date", "url"];

  return formData.reduce((acc: React.ReactNode[], input, index) => {
    const { visible = true } = input;
    // const inputSize = input.size || size;

    if (commonInputTypes.includes(input.type) && visible) {
      acc.push(
        <Controller
          key={index}
          name={input.name}
          control={control}
          render={({ field, fieldState }) => (
            <FormInputWrapper
              {...input}
              errorMessage={fieldState?.error?.message}
            >
              <Input
                {...field}
                type={input.type}
                disabled={input.disabled}
                placeholder={input.placeholder}
                className={cn(input.inputClassName)}
                onChange={(e) => {
                  const value = e.target.value;

                  if (input.type === "number") {
                    // Handle empty string separately (user clears the input)
                    if (value === "") {
                      field.onChange(null);
                    } else {
                      const parsedValue = Number(value);

                      if (!isNaN(parsedValue)) {
                        field.onChange(parsedValue);
                      }
                    }
                  } else {
                    field.onChange(value);
                  }
                }}
              />
            </FormInputWrapper>
          )}
        />
      );
    }

    // if (input.type === "password" && visible) {
    //   acc.push(
    //     <Controller
    //       key={index}
    //       name={input.name}
    //       control={control}
    //       render={({ field, fieldState }) => (
    //         <FormInputWrapper
    //           {...input}
    //           errorMessage={fieldState?.error?.message}
    //         >
    //           <PasswordField
    //             inputProps={{
    //               ...field,
    //               placeholder: input.placeholder,
    //               disabled: input.disabled,
    //             }}
    //             className={input.inputClassName}
    //           />
    //         </FormInputWrapper>
    //       )}
    //     />
    //   );
    // }

    if (input.type === "textarea" && visible) {
      acc.push(
        <Controller
          key={index}
          name={input.name}
          control={control}
          render={({ field, fieldState }) => (
            <FormInputWrapper
              {...input}
              errorMessage={fieldState?.error?.message}
            >
              <Textarea
                {...field}
                placeholder={input.placeholder}
                disabled={input.disabled}
                className={cn(input.inputClassName)}
              />
            </FormInputWrapper>
          )}
        />
      );
    }

    if (input.type === "single-checkbox" && visible) {
      acc.push(
        <Controller
          key={index}
          name={input.name}
          control={control}
          render={({ field, fieldState }) => (
            <FormInputWrapper
              {...input}
              errorMessage={fieldState?.error?.message}
            >
              <Checkbox
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                disabled={input.disabled}
              />
            </FormInputWrapper>
          )}
        />
      );
    } else if (input.type === "switch" && visible) {
      acc.push(
        <Controller
          key={index}
          name={input.name}
          control={control}
          render={({ field, fieldState }) => (
            <FormInputWrapper
              {...input}
              errorMessage={fieldState?.error?.message}
            >
              <Switch
                id={input.name}
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                disabled={input.disabled}
                className={cn(input.inputClassName)}
              />
              <Label htmlFor={input.name} className="ml-2">
                {input.label}
              </Label>
            </FormInputWrapper>
          )}
        />
      );
    }

    if (input.type === "multiple-checkbox" && visible) {
      acc.push(
        <Controller
          key={index}
          name={input.name}
          control={control}
          render={({ fieldState }) => (
            <FormInputWrapper
              {...input}
              errorMessage={fieldState?.error?.message}
            >
              <div className="space-y-2">
                {input?.options?.map((option: OptionType, i: number) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${input.name}-${i}`}
                      value={option.value ?? []}
                    />
                    <Label htmlFor={`${input.name}-${i}`}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </FormInputWrapper>
          )}
        />
      );
    }

    if (input.type === "radio" && visible) {
      acc.push(
        <Controller
          key={index}
          name={input.name}
          control={control}
          render={({ field, fieldState }) => (
            <FormInputWrapper
              {...input}
              errorMessage={fieldState?.error?.message}
            >
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-2"
              >
                {input?.options?.map((option: OptionType, i: number) => (
                  <div key={i} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option.value}
                      id={`${input.name}-${i}`}
                    />
                    <Label htmlFor={`${input.name}-${i}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </FormInputWrapper>
          )}
        />
      );
    }

    // if (input.type === "two-way-range" && visible) {
    //   acc.push(
    //     <Controller
    //       key={index}
    //       name={input.name}
    //       control={control}
    //       render={({ field, fieldState }) => (
    //         <FormInputWrapper
    //           {...input}
    //           errorMessage={fieldState?.error?.message}
    //         >
    //           <TooltipSlider
    //             range
    //             min={input.min || 0}
    //             max={input.max || 100}
    //             value={field.value}
    //             onChange={field.onChange}
    //           />
    //         </FormInputWrapper>
    //       )}
    //     />
    //   );
    // }

    if (input.type === "select" && visible) {
      acc.push(
        <Controller
          key={index}
          name={input.name}
          control={control}
          render={({ field, fieldState }) => (
            <FormInputWrapper
              {...input}
              errorMessage={fieldState?.error?.message}
            >
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${input.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {input?.options?.map((option: OptionType, i: number) => (
                    <SelectItem key={i} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormInputWrapper>
          )}
        />
      );
    }

    if (input.type === "file" && visible) {
      acc.push(
        <Controller
          key={index}
          name={input.name}
          control={control}
          defaultValue={null}
          render={({ field, fieldState }) => {
            const file = field.value?.[0];
            return (
              <FormInputWrapper
                {...input}
                errorMessage={fieldState?.error?.message}
              >
                <input
                  type="file"
                  className="hidden"
                  accept={input?.accept}
                  id={input.name}
                  onChange={(e) => field.onChange(e.target.files)}
                />
                <Label htmlFor={input.name} className="cursor-pointer">
                  {file ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center border-2 border-dashed rounded">
                      <Camera className="text-lg" />
                    </div>
                  )}
                </Label>
                {file && (
                  <button
                    type="button"
                    className="absolute top-2/3 right-0 transform -translate-y-1/2 btn btn-xs btn-circle bg-red-500 text-white"
                    onClick={() => field.onChange(null)}
                  >
                    <CroissantIcon />
                  </button>
                )}
              </FormInputWrapper>
            );
          }}
        />
      );
    }

    return acc;
  }, []);
};
