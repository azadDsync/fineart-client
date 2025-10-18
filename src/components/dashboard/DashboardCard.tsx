"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardCardProps = React.ComponentProps<typeof Card>;

export function DashboardCard({ className, ...props }: DashboardCardProps) {
  return (
    <Card
      className={cn(
        "border-black dark:bg-neutral-900 dark:border-neutral-700/40 bg-neutral-50 ",
        className
      )}
      {...props}
    />
  );
}

export default DashboardCard;
