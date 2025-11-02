import { ReactNode } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <Card className={`card-shadow ${className}`}>
      <CardContent className="text-center py-12">
        <div className="w-12 h-12 mx-auto mb-4 text-gray-400 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction}>{actionLabel}</Button>
        )}
      </CardContent>
    </Card>
  );
}
