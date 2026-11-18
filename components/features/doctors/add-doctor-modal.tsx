"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateDoctor } from "@/hooks/useDoctors";
import { HOSPITALS, SPECIALIZATIONS } from "@/lib/constants";
import { AppSelect } from "@/components/ui/app-select";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

const createDoctorSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Phone is required"),
  specialization: z.string().trim().min(1, "Specialization is required"),
  hospital: z.string().trim().min(1, "Hospital is required"),
});

type CreateDoctorFormValues = z.infer<typeof createDoctorSchema>;

type AddDoctorModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddDoctorModal({ open, onOpenChange }: AddDoctorModalProps) {
  const createDoctor = useCreateDoctor();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDoctorFormValues>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialization: "",
      hospital: "",
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = handleSubmit(async (values) => {
    await createDoctor.mutateAsync(values);
    handleOpenChange(false);
  });

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Add doctor"
      description="Create a new doctor profile."
      size="md"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={createDoctor.isPending}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-doctor-form"
            disabled={createDoctor.isPending}
          >
            {createDoctor.isPending ? (
              <>
                <Loader2 className="animate-spin" data-icon="inline-start" />
                Saving...
              </>
            ) : (
              "Add doctor"
            )}
          </Button>
        </>
      }
    >
      <form id="add-doctor-form" onSubmit={onSubmit} className="grid gap-4">
        <FormField
          label="Full name"
          htmlFor="doctor-name"
          required
          error={errors.name?.message}
        >
          <Input id="doctor-name" placeholder="Dr. Jane Smith" {...register("name")} />
        </FormField>

        <FormField
          label="Email"
          htmlFor="doctor-email"
          required
          error={errors.email?.message}
        >
          <Input
            id="doctor-email"
            type="email"
            placeholder="doctor@example.com"
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Phone"
          htmlFor="doctor-phone"
          required
          error={errors.phone?.message}
        >
          <Input
            id="doctor-phone"
            type="tel"
            placeholder="+1..."
            {...register("phone")}
          />
        </FormField>

        <FormField
          label="Specialization"
          htmlFor="doctor-specialization"
          required
          error={errors.specialization?.message}
        >
          <Controller
            control={control}
            name="specialization"
            render={({ field }) => (
              <AppSelect
                id="doctor-specialization"
                value={field.value}
                placeholder="Select specialization"
                onChange={field.onChange}
                options={SPECIALIZATIONS.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            )}
          />
        </FormField>

        <FormField
          label="Hospital"
          htmlFor="doctor-hospital"
          required
          error={errors.hospital?.message}
        >
          <Controller
            control={control}
            name="hospital"
            render={({ field }) => (
              <AppSelect
                id="doctor-hospital"
                value={field.value}
                placeholder="Select hospital"
                onChange={field.onChange}
                options={HOSPITALS.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            )}
          />
        </FormField>
      </form>
    </Modal>
  );
}
