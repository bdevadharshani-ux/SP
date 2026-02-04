import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const CreateRequestModal = ({ onSubmit, onClose }) => {
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [foodType, setFoodType] = useState(""); // veg / non-veg

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      foodName,
      quantity,
      foodType, // NEW FIELD
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">
        Create Food Request
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Food Name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          required
        />

        <Input
          placeholder="Quantity (e.g. 10 plates)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        {/* Veg / Non-Veg Select */}
        <Select onValueChange={setFoodType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select Food Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="veg">Vegetarian</SelectItem>
            <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequestModal;
