import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import { medicineApi } from '../services/medicineApi';

export default function MedicineList() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadMedicines = async () => {
      try {
        const response = await medicineApi.getMedicines();

        if (active) {
          setMedicines(response);
        }
      } catch (apiError) {
        if (active) {
          setError(apiError.message || 'Unable to load medicines.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadMedicines();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <Loading message="Loading medicines..." />;
  }

  return (
    <div className="page-shell">
      <div className="page-header with-button">
        <h1>Medicine List</h1>
        <button type="button" className="primary-button" onClick={() => navigate('/medicines/add')}>
          Add Medicine
        </button>
      </div>

      <ErrorMessage message={error} />

      {!error && medicines.length === 0 && (
        <p className="status-message">No medicines available yet.</p>
      )}

      {!error && medicines.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Brand Name</th>
                <th>Category</th>
                <th>Stock Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine) => (
                <tr key={medicine.id}>
                  <td>{medicine.brand_name}</td>
                  <td>{medicine.category}</td>
                  <td>{medicine.stock_quantity}</td>
                  <td>
                    <Link to={`/medicines/${medicine.id}`} className="link-button">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
