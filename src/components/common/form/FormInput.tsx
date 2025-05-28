import FormInputWrapper from "@/components/common/form/FormInputWrapper";
import MediaModal from "@/components/common/MediaModal";
import { Button } from "@/components/ui/button";
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
import { Camera, RefreshCw, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Control, Controller, FieldValues, useWatch } from "react-hook-form";

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
  | "switch"
  | "media";

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
  isMultiple?: boolean; // for file input
}

interface FormInputProps {
  formData: FormInputConfig[];
  control: Control<FieldValues>;
  size?: "sm" | "md" | "lg";
}

export const FormInput = ({ formData, control }: FormInputProps) => {
  const [mediaModalOpenFor, setMediaModalOpenFor] = useState<{
    name: string;
    value?: string;
  } | null>(null);

  const watch = useWatch({
    control,
  });

  // Function to handle media selection
  const handleMediaSelect = (
    url: string | string[],
    fieldOnChange: (url: string | string[]) => void,
    value: string | string[] | null,
    isMultiple: boolean = false
  ) => {
    fieldOnChange(url);

    if (!isMultiple) {
      setMediaModalOpenFor(null); // close modal
    }
  };

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

    if (input.type === "media" && visible) {
      acc.push(
        <Controller
          key={index}
          name={input.name}
          control={control}
          render={({ field, fieldState }) => {
            return (
              <FormInputWrapper
                {...input}
                errorMessage={fieldState?.error?.message}
              >
                <div className="flex items-center justify-between space-x-4 bg-gray-100 p-1 rounded">
                  {field?.value && field?.value?.length > 0 ? (
                    input.isMultiple && Array.isArray(field.value) ? (
                      <div className="flex items-center gap-1 overflow-x-auto">
                        {field.value.map((url: string, i: number) => (
                          <Image
                            key={i}
                            src={url || "/placeholder.svg"}
                            alt="selected media"
                            className="w-9 h-9 object-cover rounded"
                            width={80}
                            height={80}
                          />
                        ))}
                      </div>
                    ) : (
                      <Image
                        src={field.value || "/placeholder.svg"}
                        alt="selected media"
                        className="w-9 h-9 object-cover rounded"
                        width={80}
                        height={80}
                      />
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setMediaModalOpenFor({
                          name: input.name,
                          value: field?.value,
                        })
                      }
                      className="w-full h-9 border-2 border-dashed flex items-center gap-2 cursor-pointer hover:bg-gray-200 justify-center rounded"
                    >
                      <Camera className="text-gray-400" size={18} /> Select
                      Media
                    </button>
                  )}

                  {field?.value && field?.value?.length > 0 && (
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          setMediaModalOpenFor({
                            name: input.name,
                            value: field.value,
                          })
                        }
                        className="btn btn-primary"
                      >
                        <RefreshCw size={5} />
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          field.onChange(null);
                        }}
                      >
                        <X size={5} />
                      </Button>
                    </div>
                  )}
                </div>

                {mediaModalOpenFor?.name === input.name && (
                  <MediaModal
                    onClose={() => setMediaModalOpenFor(null)}
                    value={watch[input.name]}
                    isMultiple={input.isMultiple}
                    onSelect={(url) =>
                      handleMediaSelect(
                        url,
                        field.onChange,
                        watch[input.name],
                        input.isMultiple
                      )
                    }
                  />
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
