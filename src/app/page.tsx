'use client';
import { useState } from 'react';
import { useCVState } from '../hooks/useCVState';
import RichEditor from '../components/RichEditor';

const formatBulanTahun = (dateString: string) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  if (!year || !month) return dateString;
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${bulan[parseInt(month, 10) - 1]} ${year}`;
};

export default function CVBuilderPage() {
  const { data, setData, sortData, moveData, removeData, clearCache, isLoaded } = useCVState();
  const [draggedItem, setDraggedItem] = useState<{ type: string, index: number } | null>(null);

  if (!isLoaded) return null;

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    const baseName = data.personal.fullName.trim().replace(/\s+/g, '_') || 'CV_ATS';
    let fileName = baseName;

    if (data.experience && data.experience.length > 0) {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const bulanArray = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const month = bulanArray[today.getMonth()];
      const year = today.getFullYear();
      fileName = `${baseName}_Update_${day}_${month}_${year}`;
    }

    document.title = fileName;

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
        clearCache();
      }, 1000);
    }, 100);
  };

  const addExperience = () => setData(prev => ({ ...prev, experience: [...prev.experience, { id: crypto.randomUUID(), position: '', company: '', startDate: '', endDate: '', description: '' }] }));
  const addEducation = () => setData(prev => ({ ...prev, education: [...prev.education, { id: crypto.randomUUID(), level: 'S1', major: '', faculty: '', degree: '', gpaOrNem: '', institution: '', documentLink: '', description: '' }] }));
  const addCertification = () => setData(prev => ({ ...prev, certifications: [...prev.certifications, { id: crypto.randomUUID(), name: '', credentialLink: '', issueDate: '', expiryDate: '', organization: '', description: '' }] }));

  const handleDragStart = (e: React.DragEvent, type: string, index: number) => {
    setDraggedItem({ type, index });
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { if (e.currentTarget instanceof HTMLElement) e.currentTarget.classList.add('opacity-40', 'scale-[0.99]'); }, 0);
  };
  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null);
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.classList.remove('opacity-40', 'scale-[0.99]');
  };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDrop = (e: React.DragEvent, type: string, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem && draggedItem.type === type && draggedItem.index !== dropIndex) moveData(type as any, draggedItem.index, dropIndex);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      
      {/* ================================== FORM AREA ================================== */}
      <div className="w-1/2 h-screen overflow-y-auto border-r no-print flex flex-col relative">
        <div className="flex justify-between items-center sticky top-0 bg-gray-50 px-8 py-5 z-20 border-b w-full">
          <h1 className="text-2xl font-bold">CV Builder (ATS)</h1>
          <button onClick={handleDownloadPDF} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">Export PDF & Selesai</button>
        </div>

        <div className="p-8 space-y-8">
          {/* 1. DATA PRIBADI */}
          <section className="bg-white p-6 rounded shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Informasi Utama</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Nama Lengkap" className="p-2 border rounded col-span-2" value={data.personal.fullName} onChange={e => setData({...data, personal: {...data.personal, fullName: e.target.value}})} />
              <input type="text" placeholder="Posisi Dilamar" className="p-2 border rounded col-span-2" value={data.personal.position} onChange={e => setData({...data, personal: {...data.personal, position: e.target.value}})} />
              <input type="text" placeholder="Domisili (ex: Jakarta, Indonesia)" className="p-2 border rounded" value={data.personal.domicile} onChange={e => setData({...data, personal: {...data.personal, domicile: e.target.value}})} />
              <input type="text" placeholder="No. HP" className="p-2 border rounded" value={data.personal.phone} onChange={e => setData({...data, personal: {...data.personal, phone: e.target.value}})} />
              <input type="email" placeholder="Email" className="p-2 border rounded" value={data.personal.email} onChange={e => setData({...data, personal: {...data.personal, email: e.target.value}})} />
              <input type="text" placeholder="LinkedIn URL / Username" className="p-2 border rounded" value={data.personal.linkedin} onChange={e => setData({...data, personal: {...data.personal, linkedin: e.target.value}})} />
              <div className="flex gap-2">
                <select className="p-2 border rounded w-1/3" value={data.personal.socialType} onChange={e => setData({...data, personal: {...data.personal, socialType: e.target.value as any}})}>
                  <option value="Github">Github</option><option value="Instagram">Instagram</option><option value="X">X (Twitter)</option>
                </select>
                <input type="text" placeholder="Username / URL" className="p-2 border rounded w-2/3" value={data.personal.socialLink} onChange={e => setData({...data, personal: {...data.personal, socialLink: e.target.value}})} />
              </div>
              <input type="text" placeholder="URL Web / Portfolio" className="p-2 border rounded" value={data.personal.portfolio} onChange={e => setData({...data, personal: {...data.personal, portfolio: e.target.value}})} />
            </div>
            <h2 className="text-xl font-bold mt-6 mb-2">Ringkasan Diri</h2>
            <textarea rows={4} className="w-full p-2 border rounded" placeholder="Tuliskan ringkasan profesional Anda..." value={data.personal.summary} onChange={e => setData({...data, personal: {...data.personal, summary: e.target.value}})} />
          </section>

          {/* 2. PENGALAMAN KERJA */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Pengalaman Kerja</h2>
              <button onClick={() => sortData('experience')} className="text-sm text-blue-600 font-semibold hover:underline bg-blue-50 px-3 py-1 rounded">Urutkan Tahun Otomatis</button>
            </div>
            {data.experience.map((exp, index) => (
              <div key={exp.id} draggable onDragStart={(e) => handleDragStart(e, 'experience', index)} onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'experience', index)} className="animate-fade-in bg-white border rounded shadow-sm mb-4 transition-all duration-200">
                <div className="bg-gray-100 p-2 flex justify-between items-center text-gray-500 rounded-t border-b cursor-grab active:cursor-grabbing hover:bg-gray-200 transition">
                  <span className="text-xs font-bold uppercase flex items-center gap-2"><span className="text-lg leading-none">⠿</span> Geser Tahan</span>
                  <div className="flex gap-2 items-center">
                    <button type="button" onClick={() => moveData('experience', index, index - 1)} disabled={index === 0} className="hover:text-black px-2 disabled:opacity-30">▲ Naik</button>
                    <button type="button" onClick={() => moveData('experience', index, index + 1)} disabled={index === data.experience.length - 1} className="hover:text-black px-2 border-r border-gray-300 pr-4 disabled:opacity-30">▼ Turun</button>
                    <button type="button" onClick={() => removeData('experience', exp.id)} className="text-red-500 hover:text-red-700 font-bold px-2">✕ Hapus</button>
                  </div>
                </div>
                <div className="p-4">
                  <input type="text" placeholder="Posisi / Jabatan" className="w-full mb-2 p-2 border rounded" value={exp.position} onChange={e => { const n = [...data.experience]; n[index].position = e.target.value; setData({...data, experience: n}); }} />
                  <input type="text" placeholder="Nama Perusahaan" className="w-full mb-2 p-2 border rounded" value={exp.company} onChange={e => { const n = [...data.experience]; n[index].company = e.target.value; setData({...data, experience: n}); }} />
                  <div className="flex gap-2 mb-2">
                    <input type="month" className="w-1/2 p-2 border rounded" value={exp.startDate} onChange={e => { const n = [...data.experience]; n[index].startDate = e.target.value; setData({...data, experience: n}); }}/>
                    <input type="month" className="w-1/2 p-2 border rounded" value={exp.endDate} onChange={e => { const n = [...data.experience]; n[index].endDate = e.target.value; setData({...data, experience: n}); }} title="Kosongkan jika masih bekerja"/>
                  </div>
                  <RichEditor value={exp.description} onChange={val => { const n = [...data.experience]; n[index].description = val; setData({...data, experience: n}); }} />
                </div>
              </div>
            ))}
            <button onClick={addExperience} className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded font-semibold hover:bg-gray-100">+ Tambah Pengalaman</button>
          </section>

          {/* 3. PENDIDIKAN */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Pendidikan</h2>
            </div>
            {data.education.map((edu, index) => (
              <div key={edu.id} draggable onDragStart={(e) => handleDragStart(e, 'education', index)} onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'education', index)} className="animate-fade-in bg-white border rounded shadow-sm mb-4 transition-all duration-200">
                <div className="bg-gray-100 p-2 flex justify-between items-center text-gray-500 rounded-t border-b cursor-grab active:cursor-grabbing hover:bg-gray-200 transition">
                  <span className="text-xs font-bold uppercase flex items-center gap-2"><span className="text-lg leading-none">⠿</span> Geser Tahan</span>
                  <div className="flex gap-2 items-center">
                    <button type="button" onClick={() => moveData('education', index, index - 1)} disabled={index === 0} className="hover:text-black px-2 disabled:opacity-30">▲ Naik</button>
                    <button type="button" onClick={() => moveData('education', index, index + 1)} disabled={index === data.education.length - 1} className="hover:text-black px-2 border-r border-gray-300 pr-4 disabled:opacity-30">▼ Turun</button>
                    <button type="button" onClick={() => removeData('education', edu.id)} className="text-red-500 hover:text-red-700 font-bold px-2">✕ Hapus</button>
                  </div>
                </div>
                <div className="p-4">
                  <select className="w-full mb-2 p-2 border rounded font-bold" value={edu.level} onChange={e => { const n = [...data.education]; n[index].level = e.target.value as any; setData({...data, education: n}); }}>
                    <option value="S1">Tingkat Universitas (S1/D3, dsb)</option>
                    <option value="SMA/SMK">Tingkat Sekolah (SMA/SMK/Sederajat)</option>
                  </select>
                  <input type="text" placeholder={edu.level === 'S1' ? "Nama Universitas / Institusi" : "Nama Sekolah"} className="w-full mb-2 p-2 border rounded" value={edu.institution} onChange={e => { const n = [...data.education]; n[index].institution = e.target.value; setData({...data, education: n}); }} />
                  <input type="text" placeholder={edu.level === 'S1' ? "Fakultas (Opsional)" : "Jurusan"} className="w-full mb-2 p-2 border rounded" value={edu.faculty} onChange={e => { const n = [...data.education]; n[index].faculty = e.target.value; setData({...data, education: n}); }} />
                  <div className="flex gap-2 mb-2">
                    <input type="text" placeholder="Program Studi" className="w-1/2 p-2 border rounded" value={edu.major} onChange={e => { const n = [...data.education]; n[index].major = e.target.value; setData({...data, education: n}); }} />
                    <input type="text" placeholder={edu.level === 'S1' ? "Gelar (ex: S.Kom)" : "Kosongkan/Abaikan"} className="w-1/2 p-2 border rounded" value={edu.degree} onChange={e => { const n = [...data.education]; n[index].degree = e.target.value; setData({...data, education: n}); }} disabled={edu.level === 'SMA/SMK'} />
                  </div>
                  <div className="flex gap-2 mb-2">
                    <input type="text" placeholder={edu.level === 'S1' ? "IPK (ex: 3.80/4.00)" : "NEM/Nilai Akhir"} className="w-1/2 p-2 border rounded" value={edu.gpaOrNem} onChange={e => { const n = [...data.education]; n[index].gpaOrNem = e.target.value; setData({...data, education: n}); }} />
                    <input type="text" placeholder="Link Berkas/Ijazah (URL)" className="w-1/2 p-2 border rounded" value={edu.documentLink} onChange={e => { const n = [...data.education]; n[index].documentLink = e.target.value; setData({...data, education: n}); }} />
                  </div>
                  <RichEditor value={edu.description} onChange={val => { const n = [...data.education]; n[index].description = val; setData({...data, education: n}); }} />
                </div>
              </div>
            ))}
            <button onClick={addEducation} className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded font-semibold hover:bg-gray-100">+ Tambah Pendidikan</button>
          </section>

          {/* 4. SERTIFIKASI */}
          <section>
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sertifikasi</h2>
              <button onClick={() => sortData('certifications')} className="text-sm text-blue-600 font-semibold hover:underline bg-blue-50 px-3 py-1 rounded">Urutkan Tahun Otomatis</button>
            </div>
            {data.certifications.map((cert, index) => (
              <div key={cert.id} draggable onDragStart={(e) => handleDragStart(e, 'certifications', index)} onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'certifications', index)} className="animate-fade-in bg-white border rounded shadow-sm mb-4 transition-all duration-200">
                <div className="bg-gray-100 p-2 flex justify-between items-center text-gray-500 rounded-t border-b cursor-grab active:cursor-grabbing hover:bg-gray-200 transition">
                  <span className="text-xs font-bold uppercase flex items-center gap-2"><span className="text-lg leading-none">⠿</span> Geser Tahan</span>
                  <div className="flex gap-2 items-center">
                    <button type="button" onClick={() => moveData('certifications', index, index - 1)} disabled={index === 0} className="hover:text-black px-2 disabled:opacity-30">▲ Naik</button>
                    <button type="button" onClick={() => moveData('certifications', index, index + 1)} disabled={index === data.certifications.length - 1} className="hover:text-black px-2 border-r border-gray-300 pr-4 disabled:opacity-30">▼ Turun</button>
                    <button type="button" onClick={() => removeData('certifications', cert.id)} className="text-red-500 hover:text-red-700 font-bold px-2">✕ Hapus</button>
                  </div>
                </div>
                <div className="p-4">
                  <input type="text" placeholder="Nama Sertifikat" className="w-full mb-2 p-2 border rounded" value={cert.name} onChange={e => { const n = [...data.certifications]; n[index].name = e.target.value; setData({...data, certifications: n}); }} />
                  <input type="text" placeholder="Organisasi / Tempat Penerbit" className="w-full mb-2 p-2 border rounded" value={cert.organization} onChange={e => { const n = [...data.certifications]; n[index].organization = e.target.value; setData({...data, certifications: n}); }} />
                  <div className="flex gap-2 mb-2">
                    <input type="month" className="w-1/2 p-2 border rounded" value={cert.issueDate} onChange={e => { const n = [...data.certifications]; n[index].issueDate = e.target.value; setData({...data, certifications: n}); }}/>
                    <input type="month" className="w-1/2 p-2 border rounded" value={cert.expiryDate} onChange={e => { const n = [...data.certifications]; n[index].expiryDate = e.target.value; setData({...data, certifications: n}); }} title="Kosongkan jika tidak ada kadaluarsa"/>
                  </div>
                  <input type="text" placeholder="Link Kredensial" className="w-full mb-2 p-2 border rounded" value={cert.credentialLink} onChange={e => { const n = [...data.certifications]; n[index].credentialLink = e.target.value; setData({...data, certifications: n}); }} />
                  <RichEditor value={cert.description} onChange={val => { const n = [...data.certifications]; n[index].description = val; setData({...data, certifications: n}); }} />
                </div>
              </div>
            ))}
            <button onClick={addCertification} className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded font-semibold hover:bg-gray-100">+ Tambah Sertifikasi</button>
          </section>

          {/* 5. KEAHLIAN */}
          <section className="bg-white p-6 rounded shadow-sm mb-20">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Keahlian (Skills)</h2>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1">Keahlian Utama (Hard Skills)</label>
              <RichEditor value={data.skills.main} onChange={val => setData({...data, skills: {...data.skills, main: val}})} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1">Keahlian Lainnya (Soft Skills)</label>
              <input type="text" placeholder="ex: Problem Solving, Teamwork, Desain Grafis" className="w-full p-2 border rounded" value={data.skills.others} onChange={e => setData({...data, skills: {...data.skills, others: e.target.value}})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Bahasa</label>
              <input type="text" placeholder="ex: Indonesia (Native), English (Intermediate)" className="w-full p-2 border rounded" value={data.skills.languages} onChange={e => setData({...data, skills: {...data.skills, languages: e.target.value}})} />
            </div>
          </section>
        </div>
      </div>

      {/* ================================== LIVE PREVIEW AREA ================================== */}
      <div className="w-1/2 bg-gray-400 p-8 h-screen overflow-y-auto print:w-full print:h-auto print:bg-white print:p-0 print:overflow-visible flex justify-center items-start">
        <div className="w-[210mm] min-h-[297mm] bg-white p-[10mm] shadow-xl print:shadow-none print:m-0 text-black font-sans leading-tight">
          
          <header className="text-center border-b border-black pb-3 mb-4">
            <h1 className="text-3xl font-semibold capitalize">{data.personal.fullName || 'Nama Lengkap'}</h1>
            <p className="text-lg mt-1 font-semibold text-gray-800">{data.personal.position}</p>
            
            <div className="flex flex-wrap justify-center items-center gap-2 text-sm mt-2 font-medium">
              {data.personal.domicile && <span>{data.personal.domicile}</span>}
              {data.personal.phone && <span>| {data.personal.phone}</span>}
              {data.personal.email && <span>| {data.personal.email}</span>}
            </div>

            {/* SOCIAL LINKS - Diubah menjadi anchor link bersih dengan nama platform */}
            <div className="flex flex-wrap justify-center items-center gap-2 text-sm mt-1">
              {[
                data.personal.linkedin && (
                  <a 
                    key="linkedin" 
                    href={data.personal.linkedin.startsWith('http') ? data.personal.linkedin : `https://${data.personal.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 underline print:text-black font-medium"
                  >
                    LinkedIn
                  </a>
                ),
                data.personal.socialLink && (
                  <a 
                    key="social" 
                    href={data.personal.socialLink.startsWith('http') ? data.personal.socialLink : `https://${data.personal.socialLink}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 underline print:text-black font-medium"
                  >
                    {data.personal.socialType}
                  </a>
                ),
                data.personal.portfolio && (
                  <a 
                    key="portfolio" 
                    href={data.personal.portfolio.startsWith('http') ? data.personal.portfolio : `https://${data.personal.portfolio}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 underline print:text-black font-medium"
                  >
                    Portofolio
                  </a>
                )
              ].filter(Boolean).reduce((prev, curr, i) => 
                prev === null ? [curr] : [...prev, <span key={`sep-${i}`} className="text-gray-500 font-normal">|</span>, curr], 
              null as any)}
            </div>
          </header>

          {data.personal.summary && (
            <section className="mb-4">
              <p className="text-sm text-justify leading-relaxed">{data.personal.summary}</p>
            </section>
          )}

          {data.experience.length > 0 && (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase border-b border-black mb-2 pb-1">Pengalaman Kerja</h2>
              {data.experience.map((exp) => (
                <div key={exp.id} className="mb-3">
                  <div className="flex justify-between font-bold text-sm">
                    <span>{exp.position}</span>
                    <span>{formatBulanTahun(exp.startDate)} {exp.startDate && '-'} {exp.endDate ? formatBulanTahun(exp.endDate) : (exp.startDate ? 'Saat ini' : '')}</span>
                  </div>
                  <div className="text-sm font-medium italic text-gray-800">{exp.company}</div>
                  <div className="mt-1 text-sm prose prose-sm prose-p:my-0 prose-ul:my-0 prose-li:my-0 max-w-none text-black leading-snug" dangerouslySetInnerHTML={{ __html: exp.description }} />
                </div>
              ))}
            </section>
          )}

          {data.education.length > 0 && (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase border-b border-black mb-2 pb-1">Pendidikan</h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between font-bold text-sm">
                    <span>{edu.major} {edu.degree && `, ${edu.degree}`}</span>
                    {edu.gpaOrNem && <span>{edu.level === 'S1' ? 'IPK:' : 'Nilai:'} {edu.gpaOrNem}</span>}
                  </div>
                  <div className="text-sm flex justify-between items-center text-gray-800">
                    <span className="italic">{edu.institution} {edu.faculty && `- Fakultas ${edu.faculty}`}</span>
                    {edu.documentLink && <a href={edu.documentLink} target="_blank" className="text-xs text-blue-600 underline print:text-black">Lihat Berkas</a>}
                  </div>
                  {edu.description && edu.description !== '<p><br></p>' && (
                    <div className="mt-1 text-sm prose prose-sm prose-p:my-0 prose-ul:my-0 prose-li:my-0 max-w-none text-black leading-snug" dangerouslySetInnerHTML={{ __html: edu.description }} />
                  )}
                </div>
              ))}
            </section>
          )}

          {data.certifications.length > 0 && (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase border-b border-black mb-2 pb-1">Sertifikasi</h2>
              {data.certifications.map((cert) => (
                <div key={cert.id} className="mb-3">
                  <div className="flex justify-between font-bold text-sm">
                    <div className="flex items-center gap-2">
                       <span>{cert.name}</span>
                       {cert.credentialLink && <a href={cert.credentialLink} target="_blank" className="text-xs font-normal text-blue-600 underline print:text-black">[Kredensial]</a>}
                    </div>
                    <span>{formatBulanTahun(cert.issueDate)} {cert.expiryDate ? `- ${formatBulanTahun(cert.expiryDate)}` : ''}</span>
                  </div>
                  <div className="text-sm font-medium italic text-gray-800">{cert.organization}</div>
                  {cert.description && cert.description !== '<p><br></p>' && (
                    <div className="mt-1 text-sm prose prose-sm prose-p:my-0 prose-ul:my-0 prose-li:my-0 max-w-none text-black leading-snug" dangerouslySetInnerHTML={{ __html: cert.description }} />
                  )}
                </div>
              ))}
            </section>
          )}

          {((data.skills.main && data.skills.main !== '<p><br></p>') || data.skills.others || data.skills.languages) && (
            <section>
              <h2 className="text-sm font-bold uppercase border-b border-black mb-2 pb-1">Keahlian</h2>
              <div className="text-sm leading-snug space-y-1">
                {data.skills.main && data.skills.main !== '<p><br></p>' && (
                  <div className="mb-2">
                    <strong>Keahlian Utama:</strong>
                    <div className="mt-1 prose prose-sm max-w-none text-black prose-p:my-0 prose-ul:my-0 prose-li:my-0" dangerouslySetInnerHTML={{ __html: data.skills.main }} />
                  </div>
                )}
                {data.skills.others && (<div><strong>Lainnya:</strong> {data.skills.others}</div>)}
                {data.skills.languages && (<div><strong>Bahasa:</strong> {data.skills.languages}</div>)}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
