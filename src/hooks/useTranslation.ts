
import { useGlobalContext } from '@/contexts/GlobalContext';
import { getTranslation } from '@/utils/translations';

export const useTranslation = () => {
  const { language } = useGlobalContext();
  
  const t = (key: string): string => {
    return getTranslation(key, language);
  };
  
  return { t, language };
};
