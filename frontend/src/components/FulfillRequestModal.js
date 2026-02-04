import { Button } from "./ui/button";

const FulfillRequestModal = ({ request, onAccept, onClose }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">
        Request Details
      </h2>

      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Food:</span>{" "}
          {request.foodName}
        </p>

        <p>
          <span className="font-medium">Quantity:</span>{" "}
          {request.quantity}
        </p>

        <p>
          <span className="font-medium">Food Type:</span>{" "}
          <span
            className={`font-semibold ${
              request.foodType === "veg"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {request.foodType === "veg"
              ? "Vegetarian"
              : "Non-Vegetarian"}
          </span>
        </p>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onAccept(request)}>
          Accept Request
        </Button>
      </div>
    </div>
  );
};

export default FulfillRequestModal;
