import React, { useState } from 'react';
import Seeder from './Seeder';
import FormPage from './FormPage';
import Dashboard from './Dashboard';

function App() {
  const [page, setPage] = useState('form');

  return (
    <div>
      <h1>🚀 نظام رقابة التغذية</h1>
      <button onClick={() => setPage('form')}>📝 تعبئة نموذج</button>
      <button onClick={() => setPage('dashboard')}>📊 لوحة التحكم</button>
      {page === 'form' && <FormPage />}
      {page === 'dashboard' && <Dashboard />}
      <Seeder />
    </div>
  );
}

export default App;