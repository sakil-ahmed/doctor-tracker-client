"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateDoctorPatient } from "@/hooks/useDoctorDetail";
import { CONDITIONS, GENDERS } from "@/lib/constants";
import { AppSelect } from "@/components/ui/app-select";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

const createPatientSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  age: z
    .number({ error: "Age is required" })
    .int("Age must be an integer")
    .min(0, "Age cannot be negative")
    .max(150, "Age is too high"),
  gender: z.enum(["male", "female", "other"], {
    error: "Gender is required",
  }),
  phone: z.string().trim().min(1, "Phone is required"),
  email: z.email("Enter a valid email address"),
  condition: z.string().trim().min(1, "Condition is required"),
});

type CreatePatientFormValues = z.infer<typeof createPatientSchema>;

type AddPatientModalProps = {
  doctorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddPatientModal({
  doctorId,
  open,
  onOpenChange,
}: AddPatientModalProps) {
  const createPatient = useCreateDoctorPatient(doctorId);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePatientFormValues>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      name: "",
      age: 30,
      gender: "male",
      phone: "",
      email: "",
      condition: "",
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = handleSubmit(async (values) => {
    await createPatient.mutateAsync(values);
    handleOpenChange(false);
  });

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Add patient"
      description="Assign a new patient to this doctor."
      size="md"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={createPatient.isPending}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-patient-form"
            disabled={createPatient.isPending}
          >
            {createPatient.isPending ? (
              <>
                <Loader2 className="animate-spin" data-icon="inline-start" />
                Saving...
              </>
            ) : (
              "Add patient"
            )}
          </Button>
        </>
      }
    >
      <form id="add-patient-form" onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Full name"
          htmlFor="patient-name"
          required
          error={errors.name?.message}
          className="sm:col-span-2"
        >
          <Input id="patient-name" placeholder="Patient name" {...register("name")} />
        </FormField>

        <FormField
          label="Age"
          htmlFor="patient-age"
          required
          error={errors.age?.message}
        >
          <Input
            id="patient-age"
            type="number"
            min={0}
            max={150}
            {...register("age", { valueAsNumber: true })}
          />
        </FormField>

        <FormField
          label="Gender"
          htmlFor="patient-gender"
          required
          error={errors.gender?.message}
        >
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <AppSelect
                id="patient-gender"
                value={field.value}
                placeholder="Select gender"
                onChange={field.onChange}
                options={GENDERS.map((gender) => ({
                  value: gender,
                  label: gender.charAt(0).toUpperCase() + gender.slice(1),
                }))}
              />
            )}
          />
        </FormField>

        <FormField
          label="Email"
          htmlFor="patient-email"
          required
          error={errors.email?.message}
        >
          <Input
            id="patient-email"
            type="email"
            placeholder="patient@example.com"
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Phone"
          htmlFor="patient-phone"
          required
          error={errors.phone?.message}
        >
          <Input
            id="patient-phone"
            type="tel"
            placeholder="+1..."
            {...register("phone")}
          />
        </FormField>

        <FormField
          label="Condition"
          htmlFor="patient-condition"
          required
          error={errors.condition?.message}
          className="sm:col-span-2"
        >
          <Controller
            control={control}
            name="condition"
            render={({ field }) => (
              <AppSelect
                id="patient-condition"
                value={field.value}
                placeholder="Select condition"
                onChange={field.onChange}
                options={CONDITIONS.map((condition) => ({
                  value: condition,
                  label: condition,
                }))}
              />
            )}
          />
        </FormField>
      </form>
    </Modal>
  );
}
