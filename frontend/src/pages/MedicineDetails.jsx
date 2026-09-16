import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import { medicineApi } from '../services/medicineApi';

export default function MedicineDetails() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadMedicine = async () => {
      try {
        const response = await medicineApi.getMedicineById(id);

        if (active) {
          setMedicine(response);
        }
      } catch (apiError) {
        if (active) {
          setError(apiError.message || 'Unable to load medicine details.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadMedicine();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <Loading message="Loading medicine details..." />;
  }

  if (error) {
    return (
      <div className="page-shell">
        <ErrorMessage message={error} />
        <Link className="link-button" to="/medicines">
          Back to List
        </Link>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="page-shell">
        <p className="status-message">Medicine not found.</p>
        <Link className="link-button" to="/medicines">
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>Medicine Details</h1>
      </div>

      <div className="details-card">
        <div className="detail-row">
          <span className="detail-label">Brand Name:</span>
          <span>{medicine.brand_name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Category:</span>
          <span>{medicine.category}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Stock Quantity:</span>
          <span>{medicine.stock_quantity}</span>
        </div>
      </div>

      <Link className="secondary-button inline-button" to="/medicines">
        Back
      </Link>
    </div>
  );
}
