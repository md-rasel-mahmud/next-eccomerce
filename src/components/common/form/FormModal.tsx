"use client";
import { FormInput, FormInputConfig } from "@/components/common/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";
import { Control, FieldValues, SubmitHandler } from "react-hook-form";

type FormModalProps = {
  control: Control<FieldValues>;
  formData: FormInputConfig[];
  inputSize?: "sm" | "md" | "lg";
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  formSubmitHandler: SubmitHandler<FieldValues>;
  handleSubmit: (
    onValid: SubmitHandler<FieldValues>
  ) => (e?: React.BaseSyntheticEvent) => void;
  submitText?: string;
  title: string;
  isLoading?: boolean;
};

const FormModal: FC<FormModalProps> = ({
  title = "",
  control,
  formData,
  inputSize = "sm",
  isAddDialogOpen,
  setIsAddDialogOpen,
  handleSubmit,
  formSubmitHandler,
  submitText = "Submit",
  isLoading = false,
}) => {
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(formSubmitHandler)}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>

            <DialogDescription className="text-xs">
              Required fields are marked with an asterisk (
              <span className="text-destructive"> * </span>).
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-8">
            <FormInput
              {...{
                control,
                formData,
                size: inputSize,
              }}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  Loading... <Skeleton className="h-5 w-5" />
                </>
              ) : (
                submitText
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
