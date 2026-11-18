"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { DOCTOR_OPTIONS_QUERY, useDoctors } from "@/hooks/useDoctors";
import { useUpdatePatient } from "@/hooks/usePatients";
import { CONDITIONS, GENDERS } from "@/lib/constants";
import { AppSelect } from "@/components/ui/app-select";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  getPatientDoctorId,
  type Patient,
} from "@/types/patient";

const updatePatientSchema = z.object({
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
  doctor: z.string().min(1, "Doctor is required"),
});

type UpdatePatientFormValues = z.infer<typeof updatePatientSchema>;

type EditPatientModalProps = {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditPatientModal({
  patient,
  open,
  onOpenChange,
}: EditPatientModalProps) {
  const updatePatient = useUpdatePatient();
  const doctorsQuery = useDoctors(DOCTOR_OPTIONS_QUERY);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePatientFormValues>({
    resolver: zodResolver(updatePatientSchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: "male",
      phone: "",
      email: "",
      condition: "",
      doctor: "",
    },
  });

  useEffect(() => {
    if (!patient || !open) return;

    reset({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      condition: patient.condition,
      doctor: getPatientDoctorId(patient),
    });
  }, [patient, open, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!patient) return;
    await updatePatient.mutateAsync({ id: patient._id, input: values });
    handleOpenChange(false);
  });

  const doctors = doctorsQuery.data?.data ?? [];

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit patient"
      description="Update patient details and assigned doctor."
      size="md"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={updatePatient.isPending}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-patient-form"
            disabled={updatePatient.isPending}
          >
            {updatePatient.isPending ? (
              <>
                <Loader2 className="animate-spin" data-icon="inline-start" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </>
      }
    >
      <form
        id="edit-patient-form"
        onSubmit={onSubmit}
        className="grid gap-4 sm:grid-cols-2"
      >
        <FormField
          label="Full name"
          htmlFor="edit-patient-name"
          required
          error={errors.name?.message}
          className="sm:col-span-2"
        >
          <Input
            id="edit-patient-name"
            placeholder="Patient name"
            {...register("name")}
          />
        </FormField>

        <FormField
          label="Age"
          htmlFor="edit-patient-age"
          required
          error={errors.age?.message}
        >
          <Input
            id="edit-patient-age"
            type="number"
            min={0}
            max={150}
            {...register("age", { valueAsNumber: true })}
          />
        </FormField>

        <FormField
          label="Gender"
          htmlFor="edit-patient-gender"
          required
          error={errors.gender?.message}
        >
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <AppSelect
                id="edit-patient-gender"
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
          htmlFor="edit-patient-email"
          required
          error={errors.email?.message}
        >
          <Input
            id="edit-patient-email"
            type="email"
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Phone"
          htmlFor="edit-patient-phone"
          required
          error={errors.phone?.message}
        >
          <Input id="edit-patient-phone" type="tel" {...register("phone")} />
        </FormField>

        <FormField
          label="Condition"
          htmlFor="edit-patient-condition"
          required
          error={errors.condition?.message}
        >
          <Controller
            control={control}
            name="condition"
            render={({ field }) => (
              <AppSelect
                id="edit-patient-condition"
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

        <FormField
          label="Doctor"
          htmlFor="edit-patient-doctor"
          required
          error={errors.doctor?.message}
        >
          <Controller
            control={control}
            name="doctor"
            render={({ field }) => (
              <AppSelect
                id="edit-patient-doctor"
                value={field.value}
                placeholder="Select doctor"
                onChange={field.onChange}
                options={doctors.map((doctor) => ({
                  value: doctor._id,
                  label: `${doctor.name} — ${doctor.specialization}`,
                }))}
              />
            )}
          />
        </FormField>
      </form>
    </Modal>
  );
}
