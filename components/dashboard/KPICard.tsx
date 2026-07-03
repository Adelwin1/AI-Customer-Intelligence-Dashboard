import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type KPICardProps = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

export default function KPICard({
  title,
  value,
  change,
  icon: Icon,
}: KPICardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h2 className="mt-2 text-3xl font-bold">{value}</h2>
            <p className="mt-1 text-sm text-emerald-500">{change}</p>
          </div>

          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}