'use client';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(
  () => import('react-quill').then((mod) => mod.default || mod), 
  { ssr: false }
);

// Tambahkan 'link' di dalam array toolbar
const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'link'], // <-- Tombol link sekarang aktif
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean']
  ],
};

export default function RichEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  return (
    <div className="bg-white rounded-md border-gray-300">
      <ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} />
    </div>
  );
}
