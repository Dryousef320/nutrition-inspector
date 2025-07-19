import { useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import checklistForms from './data/checklistForms_full.json';

const Seeder = () => {
  useEffect(() => {
    const uploadChecklist = async () => {
      try {
        const ref = doc(db, 'appConfigs', 'checklistForms');
        await setDoc(ref, checklistForms);
        console.log("✅ تم رفع النماذج إلى Firestore");
      } catch (err) {
        console.error("❌ فشل الرفع:", err);
      }
    };
    uploadChecklist();
  }, []);

  return null;
};

export default Seeder;