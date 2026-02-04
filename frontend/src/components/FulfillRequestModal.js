import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Package, MapPin, AlertTriangle } from "lucide-react";

export const FulfillRequestModal = ({
  request,
  open,
  onOpenChange,
  onSuccess,
  userLocation,
}) => {
  if (!request) return null;

  const dietBadgeStyle =
    request.diet_type === "veg"
      ? "bg-green-600 text-white"
      : "bg-red-600 text-white";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Fulfill Food Request
          </DialogTitle>
        </DialogHeader>

        {/* Request Details */}
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">{request.ngo_name}</span>
            <Badge className={dietBadgeStyle}>
              {request.diet_type === "veg"
                ? "Vegetarian"
                : "Non-Vegetarian"}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>
              {request.food_type} • {request.quantity} servings
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{request.address}</span>
          </div>

          {request.urgency_level === "critical" && (
            <div className="flex items-center gap-2 text-red-600 font-medium">
              <AlertTriangle className="h-4 w-4" />
              Critical urgency
            </div>
          )}

          {request.description && (
            <p className="text-muted-foreground">
              {request.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await onSuccess();
                onOpenChange(false);
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Accept Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
