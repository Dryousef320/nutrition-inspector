import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore';

const FormPage = () => {
  const [formData, setFormData] = useState({});
  const [formConfig, setFormConfig] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchForm = async () => {
      const docRef = doc(db, 'appConfigs', 'checklistForms');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormConfig(docSnap.data());
      }
    };
    fetchForm();
  }, []);

  const handleChange = (sectionTitle, itemTitle, value) => {
    setFormData(prev => ({
      ...prev,
      [sectionTitle]: {
        ...prev[sectionTitle],
        [itemTitle]: value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        data: formData,
        submittedAt: Timestamp.now(),
        submittedBy: 'مشرف_1' // لاحقاً تربط مع المستخدم الحالي
      };
      await addDoc(collection(db, 'dailySubmissions'), payload);
      setStatus('✅ تم إرسال النموذج بنجاح!');
      setFormData({});
    } catch (error) {
      console.error(error);
      setStatus('❌ حدث خطأ أثناء الإرسال.');
    }
  };

  if (!formConfig) return <p>جاري تحميل النموذج...</p>;

  return (
    <div>
      <h2>📋 تعبئة نموذج الجودة</h2>
      {formConfig.sections.map((section, idx) => (
        <div key={idx}>
          <h3>{section.title}</h3>
          {section.items.map((item, iidx) => (
            <div key={iidx}>
              <label>{item.title}</label>
              {item.type === 'text' && (
                <input type="text" value={formData[section.title]?.[item.title] || ''} onChange={e => handleChange(section.title, item.title, e.target.value)} />
              )}
              {item.type === 'number' && (
                <input type="number" value={formData[section.title]?.[item.title] || ''} onChange={e => handleChange(section.title, item.title, e.target.value)} />
              )}
              {item.type === 'choice' && (
                <select value={formData[section.title]?.[item.title] || ''} onChange={e => handleChange(section.title, item.title, e.target.value)}>
                  <option value="">اختر</option>
                  {item.options.map((opt, oidx) => (
                    <option key={oidx} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>إرسال النموذج ✅</button>
      <p>{status}</p>
    </div>
  );
};

export default FormPage;