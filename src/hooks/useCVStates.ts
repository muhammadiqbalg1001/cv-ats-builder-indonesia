'use client';
import { useState, useEffect } from 'react';
import { CVData } from '../types/cv';

const INITIAL_DATA: CVData = {
  personal: {
    fullName: '',
    position: '',
    photoUrl: '',
    domicile: '',
    phone: '',
    email: '',
    linkedin: '',
    socialType: 'Github',
    socialLink: '',
    portfolio: '',
    summary: ''
  },
  experience: [],
  education: [],
  certifications: [],
  skills: {
    main: '',
    others: '',
    languages: ''
  }
};

export const useCVState = () => {
  const [data, setData] = useState<CVData>(INITIAL_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem('cv_builder_cache');
    if (cached) setData(JSON.parse(cached));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('cv_builder_cache', JSON.stringify(data));
  }, [data, isLoaded]);

  const sortData = (type: 'experience' | 'education' | 'certifications') => {
    setData(prev => {
      const newState = { ...prev };
      if (type === 'experience') {
        newState.experience = [...prev.experience].sort((a, b) => {
          const dateA = a.endDate === '' ? '9999-99' : (a.endDate || '0000-00');
          const dateB = b.endDate === '' ? '9999-99' : (b.endDate || '0000-00');
          return dateB.localeCompare(dateA);
        });
      } else if (type === 'certifications') {
        newState.certifications = [...prev.certifications].sort((a, b) => {
          const dateA = a.issueDate || '0000-00';
          const dateB = b.issueDate || '0000-00';
          return dateB.localeCompare(dateA);
        });
      }
      return newState;
    });
  };

  const moveData = (type: 'experience' | 'education' | 'certifications', fromIndex: number, toIndex: number) => {
    setData(prev => {
      const list = [...prev[type]];
      if (toIndex < 0 || toIndex >= list.length) return prev;
      const [movedItem] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, movedItem);
      return { ...prev, [type]: list as any };
    });
  };

  // FUNGSI BARU: Untuk menghapus form berdasarkan ID
  const removeData = (type: 'experience' | 'education' | 'certifications', id: string) => {
    setData(prev => ({
      ...prev,
      [type]: prev[type].filter((item: any) => item.id !== id)
    }));
  };

  const clearCache = () => {
    localStorage.removeItem('cv_builder_cache');
    setData(INITIAL_DATA);
  };

  // Pastikan removeData di-return di sini
  return { data, setData, sortData, moveData, removeData, clearCache, isLoaded };
};