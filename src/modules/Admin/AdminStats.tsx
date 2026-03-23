"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye, CalendarDays } from "lucide-react";

type Stats = {
  totalPosts: number;
  totalViews: number;
  postsThisMonth: number;
};

export default function AdminStats({ stats }: { stats: Stats }) {
  const items = [
    {
      label: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
    },
    {
      label: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
    },
    {
      label: "This Month",
      value: stats.postsThisMonth,
      icon: CalendarDays,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="border-border/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="p-3 rounded-xl bg-primary/10">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
