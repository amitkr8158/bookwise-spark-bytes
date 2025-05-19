
import React from "react";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const HeaderLogo = () => {
  const { t } = useTranslation();
  
  return (
    <Link to="/" className="flex items-center gap-2">
      <Book className="h-6 w-6 text-book-700" />
      <span className="text-xl font-serif font-bold text-book-700">
        {t('app.title')}
      </span>
    </Link>
  );
};

export default HeaderLogo;
