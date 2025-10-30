import { useContext, useMemo } from 'react';
import { getTranslations, AppTranslations } from '../services/translations';
import { useAuth } from '../context/AuthContext';

export const useTranslations = (): AppTranslations => {
  const { user } = useAuth();
  
  const translations = useMemo(() => {
    const language = user?.preferredLanguage || 'en-US';
    return getTranslations(language);
  }, [user?.preferredLanguage]);
  
  return translations;
};