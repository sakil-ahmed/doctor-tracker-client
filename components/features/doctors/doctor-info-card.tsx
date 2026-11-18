import { Building2, CalendarDays, Mail, Phone, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Doctor } from "@/types/doctor";

type DoctorInfoCardProps = {
  doctor?: Doctor;
  isLoading?: boolean;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function DoctorInfoCard({ doctor, isLoading = false }: DoctorInfoCardProps) {
  if (isLoading || !doctor) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="font-heading text-xl font-semibold">
            {doctor.name}
          </CardTitle>
          <CardDescription>{doctor.email}</CardDescription>
        </div>
        <Badge variant="secondary" className="w-fit">
          {doctor.specialization}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5 text-muted-foreground">
          <Stethoscope className="size-4 shrink-0 text-primary" />
          <span>{doctor.specialization}</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5 text-muted-foreground">
          <Building2 className="size-4 shrink-0 text-primary" />
          <span>{doctor.hospital}</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5 text-muted-foreground">
          <Phone className="size-4 shrink-0 text-primary" />
          <span>{doctor.phone}</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5 text-muted-foreground">
          <Mail className="size-4 shrink-0 text-primary" />
          <span className="truncate">{doctor.email}</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5 text-muted-foreground sm:col-span-2">
          <CalendarDays className="size-4 shrink-0 text-primary" />
          <span>Joined {formatDate(doctor.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
