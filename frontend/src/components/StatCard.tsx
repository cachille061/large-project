import { ReactNode } from "react";
import { Card, CardContent } from "./ui/card";

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  iconColor?: string;
}

export function StatCard({ 
  icon, 
  value, 
  label, 
  iconColor = "#285570" 
}: StatCardProps) {
  return (
    <Card style={{ borderColor: '#E8E7E5', backgroundColor: 'white' }}>
      <CardContent className="text-center" style={{ padding: '20px' }}>
        <div 
          className="mx-auto mb-3 flex items-center justify-center"
          style={{ width: '32px', height: '32px', color: iconColor }}
        >
          {icon}
        </div>
        <p className="stat-value">{value}</p>
        <p className="text-sm text-black">{label}</p>
      </CardContent>
    </Card>
  );
}
