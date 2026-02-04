import React, { useState, useEffect } from 'react';
import { useCreateRequest } from '../../hooks/useCreateRequest';
import { RequestContext } from '../../context/RequestContext';
import { useContext } from 'react';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ isOpen, onClose }) => {
  const { createRequest } = useCreateRequest();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    category: '',
    dietPreference: '', // ← NEW: Veg/Non-Veg field
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validation
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.dietPreference) newErrors.dietPreference = 'Diet preference is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createRequest(formData); // dietPreference automatically included
      onClose();
      setFormData({ title: '', description: '', quantity: '', category: '', dietPreference: '' });
    } catch (error) {
      console.error('Request creation failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Request</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="food">Food</option>
              <option value="clothes">Clothes</option>
              <option value="medicine">Medicine</option>
            </select>
          </div>

          {/* ← NEW: Veg/Non-Veg Dropdown */}
          <div className="form-group">
            <label>Diet Preference <span className="required">*</span></label>
            <select
              value={formData.dietPreference}
              onChange={(e) => setFormData({ ...formData, dietPreference: e.target.value })}
              className={errors.dietPreference ? 'error' : ''}
            >
              <option value="">Select Preference</option>
              <option value="veg">Vegetarian</option>
              <option value="nonveg">Non-Vegetarian</option>
            </select>
            {errors.dietPreference && (
              <span className="error-text">{errors.dietPreference}</span>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestModal;
