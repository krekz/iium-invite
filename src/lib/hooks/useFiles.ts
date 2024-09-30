import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

export function useFiles(setValue: UseFormSetValue<any>) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newFiles = [...selectedFiles, ...files].slice(0, 3);
        setSelectedFiles(newFiles);
        setValue("poster_url", newFiles);
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setValue("poster_url", newFiles);
    };

    return {
        selectedFiles,
        handleFileChange,
        removeFile
    };
}