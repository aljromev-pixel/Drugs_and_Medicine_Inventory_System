import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import { medicineApi } from '../services/medicineApi';

const initialState = {
  brand_name: '',
  category: '',
  stock_quantity: '',
};

export default function AddMedicine() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    const brandName = formData.brand_name.trim();
    const category = formData.category.trim();
    const stockQuantity = formData.stock_quantity;

    if (!brandName) {
      nextErrors.brand_name = 'Brand Name is required.';
    }

    if (!category) {
      nextErrors.category = 'Category is required.';
    }

    if (stockQuantity === '') {
      nextErrors.stock_quantity = 'Stock Quantity is required.';
    } else {
      const numericValue = Number(stockQuantity);

      if (!Number.isInteger(numericValue)) {
        nextErrors.stock_quantity = 'Stock Quantity must be a valid integer.';
      } else if (numericValue < 0) {
        nextErrors.stock_quantity = 'Stock Quantity cannot be negative.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    try {
      await medicineApi.createMedicine({
        brand_name: formData.brand_name.trim(),
        category: formData.category.trim(),
        stock_quantity: Number(formData.stock_quantity),
      });

      navigate('/medicines');
    } catch (apiError) {
      const fieldErrors = apiError.errors || {};
      const nextErrors = {};

      Object.entries(fieldErrors).forEach(([field, messages]) => {
        nextErrors[field] = Array.isArray(messages) ? messages[0] : messages;
      });

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
      }

      setSubmitError(apiError.message || 'Unable to save medicine.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>Add Medicine</h1>
      </div>

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="brand_name">Brand Name</label>
          <input
            id="brand_name"
            name="brand_name"
            type="text"
            value={formData.brand_name}
            onChange={handleChange}
          />
          {errors.brand_name && <span className="field-error">{errors.brand_name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
          />
          {errors.category && <span className="field-error">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="stock_quantity">Stock Quantity</label>
          <input
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            min="0"
            step="1"
            value={formData.stock_quantity}
            onChange={handleChange}
          />
          {errors.stock_quantity && <span className="field-error">{errors.stock_quantity}</span>}
        </div>

        <ErrorMessage message={submitError} />

        <div className="button-row">
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Medicine'}
          </button>
          <button type="button" className="secondary-button" onClick={() => navigate('/medicines')}>
            Back to List
          </button>
        </div>
      </form>
    </div>
  );
}
