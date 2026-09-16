import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { medicineApi } from '../services/medicineApi';

export default function Home() {
  const [firstMedicineId, setFirstMedicineId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    medicineApi
      .getMedicines()
      .then((response) => {
        if (active) {
          setFirstMedicineId(response[0]?.id ?? null);
        }
      })
      .catch(() => {
        if (active) {
          setError('Unable to load latest medicine details right now.');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>Home</h1>
      </div>

      <div className="card-grid">
        <Link className="nav-card" to="/medicines">
          <h2>Medicine List</h2>
          <p>View all medicines in stock.</p>
        </Link>

        <Link className="nav-card" to="/medicines/add">
          <h2>Add Medicine</h2>
          <p>Create a new medicine record.</p>
        </Link>

        <Link className="nav-card" to={firstMedicineId ? `/medicines/${firstMedicineId}` : '/medicines'}>
          <h2>Medicine Details</h2>
          <p>Review the selected medicine record.</p>
        </Link>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
