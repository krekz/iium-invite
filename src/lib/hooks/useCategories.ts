import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

export function useCategories(setValue: UseFormSetValue<any>, categories?: string[]) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories || []);

  const addCategory = (cate: string) => {
    if (
      cate === "" ||
      selectedCategories.includes(cate) ||
      selectedCategories.length >= 7
    )
      return;
    const newCategories = [...selectedCategories, cate];
    setSelectedCategories(newCategories);
    setValue("categories", newCategories);
  };

  const removeCategory = (cate: string) => {
    const newCategories = selectedCategories.filter((c) => c !== cate);
    setSelectedCategories(newCategories);
    setValue("categories", newCategories);
  };

  return { selectedCategories, addCategory, removeCategory };
}