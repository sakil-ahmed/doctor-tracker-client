import { LayoutDashboard, Stethoscope, Users, type LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Clinic overview & insights",
  },
  {
    title: "Doctors",
    href: "/doctors",
    icon: Stethoscope,
    description: "Manage doctor profiles",
  },
  {
    title: "Patients",
    href: "/patients",
    icon: Users,
    description: "Search and update records",
  },
];

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getCurrentNavItem(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => isNavActive(pathname, item.href));
}
