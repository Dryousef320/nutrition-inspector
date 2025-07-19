import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [supervisorFilter, setSupervisorFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    fetchSubmissions();
  }, [supervisorFilter, dateFrom, dateTo]);

  const fetchSubmissions = async () => {
    let q = collection(db, 'dailySubmissions');
    const constraints = [];

    if (supervisorFilter) {
      constraints.push(where('submittedBy', '==', supervisorFilter));
    }
    if (dateFrom) {
      constraints.push(where('submittedAt', '>=', Timestamp.fromDate(new Date(dateFrom))));
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      constraints.push(where('submittedAt', '<=', Timestamp.fromDate(toDate)));
    }

    const finalQuery = constraints.length > 0 ? query(q, ...constraints) : q;
    const snap = await getDocs(finalQuery);
    const list = snap.docs.map(doc => doc.data());
    setSubmissions(list);

    // Update supervisors list
    const names = new Set();
    list.forEach(sub => names.add(sub.submittedBy));
    setSupervisors([...names]);
  };

  return (
    <div>
      <h2>📊 لوحة التحكم</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <div>
          <label>🔍 اسم المشرف: </label>
          <select value={supervisorFilter} onChange={e => setSupervisorFilter(e.target.value)}>
            <option value="">الكل</option>
            {supervisors.map((sup, idx) => (
              <option key={idx} value={sup}>{sup}</option>
            ))}
          </select>
        </div>

        <div>
          <label>📅 من تاريخ: </label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </div>

        <div>
          <label>📅 إلى تاريخ: </label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
      </div>

      <p>عدد النماذج: {submissions.length}</p>
      <table border="1">
        <thead>
          <tr>
            <th>المشرف</th>
            <th>الوقت</th>
            <th>البيانات</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.submittedBy}</td>
              <td>{entry.submittedAt?.seconds ? new Date(entry.submittedAt.seconds * 1000).toLocaleString() : ''}</td>
              <td><pre>{JSON.stringify(entry.data, null, 1)}</pre></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;