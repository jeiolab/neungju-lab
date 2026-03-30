import React, { useCallback } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      onImageSelected(url);
    }
  }, [onImageSelected]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div 
        className="w-full h-32 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center cursor-pointer group relative"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
    >
        <input 
            type="file" 
            accept="image/*" 
            onChange={onChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-500 transition-colors">
            <UploadCloud size={32} className="mb-2" />
            <p className="text-sm font-medium">클릭하거나 이미지를 드래그하여 업로드</p>
            <p className="text-xs mt-1 opacity-70">JPG, PNG, WEBP 지원</p>
        </div>
    </div>
  );
};

export default ImageUploader;