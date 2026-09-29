// File: app/dashboard/anggota/page.tsx
"use client"; 

import { useState, useEffect } from "react";
import Link from "next/link"; 
import { supabase } from "../../../lib/supabase"; 

export default function DataAnggotaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [editingId, setEditingId] = useState<number | null>(null); 

  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    kelas: "",
    jabatan: "Anggota" 
  });

  const fetchMembers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("anggota")
      .select("*")
      .order("id", { ascending: true });

    if (!error) setMembers(data || []); 
    setIsLoading(false);
  };

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === "admin@ipm.belik") setIsAdmin(true);
    };
    checkUserRole();
    fetchMembers();
  }, []);

  const resetDanTutupModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ nama: "", kelas: "", jabatan: "Anggota" });
  };

  const handleSimpanData = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!isAdmin) return;
    
    if (!formData.nama || !formData.kelas) return alert("Nama dan Kelas wajib diisi!");
    setIsSubmitting(true);
    
    if (editingId !== null) {
      const { error } = await supabase.from("anggota").update({ nama: formData.nama, kelas: formData.kelas, jabatan: formData.jabatan }).eq("id", editingId); 
      if (!error) { alert("Data berhasil diperbarui!"); resetDanTutupModal(); fetchMembers(); }
    } else {
      const { error } = await supabase.from("anggota").insert([{ nama: formData.nama, kelas: formData.kelas, jabatan: formData.jabatan, status: "Aktif" }]);
      if (!error) { alert("Anggota berhasil ditambahkan!"); resetDanTutupModal(); fetchMembers(); }
    }
    setIsSubmitting(false);
  };

  const handleEditClick = (member: any) => {
    if (!isAdmin) return;
    setEditingId(member.id); 
    setFormData({ nama: member.nama, kelas: member.kelas, jabatan: member.jabatan }); 
    setIsModalOpen(true); 
  };

  const handleHapusClick = async (id: number, nama: string) => {
    if (!isAdmin) return;
    if (!window.confirm(`Yakin ingin menghapus data ${nama}?`)) return;

    const { error } = await supabase.from("anggota").delete().eq("id", id);
    if (!error) fetchMembers(); 
  };

  return (
    // PERUBAHAN 1: Memaksa tinggi halaman dan mengunci overflow
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-8 relative flex flex-col h-[calc(100vh-6rem)] sm:h-auto overflow-hidden">
      
      {/* AREA HEADER HALAMAN (TETAP DI ATAS SAAT DI-SCROLL) */}
      <div className="shrink-0 mb-4 sm:mb-8 border-b border-slate-100 pb-4 sm:pb-0 sm:border-0">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-[#003B9F] bg-blue-50 hover:bg-blue-100 transition-colors mb-4 shadow-sm border border-blue-100 group"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-800">Data Anggota</h2>
            <p className="text-slate-500 text-[10px] sm:text-sm mt-0.5">Kelola daftar anggota dan pengurus IPM.</p>
          </div>
          
          {isAdmin && (
            <button 
              onClick={() => { resetDanTutupModal(); setIsModalOpen(true); }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#003B9F] hover:bg-[#002870] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Tambah Anggota
            </button>
          )}
        </div>
      </div>

      {/* PERUBAHAN 2: AREA TABEL (HANYA INI YANG BISA DI-SCROLL) */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left border-collapse min-w-[600px]">
          {/* Kepala Tabel Dibuat Lengket (Sticky) agar tidak hilang saat scroll */}
          <thead className="sticky top-0 z-10 bg-white shadow-sm ring-1 ring-slate-100">
            <tr className="bg-slate-50 text-slate-500 text-[10px] sm:text-xs uppercase tracking-wider">
              <th className="p-3 sm:p-4 font-bold sm:rounded-tl-xl whitespace-nowrap">No</th>
              <th className="p-3 sm:p-4 font-bold whitespace-nowrap">Nama Lengkap</th>
              <th className="p-3 sm:p-4 font-bold whitespace-nowrap">Kelas</th>
              <th className="p-3 sm:p-4 font-bold whitespace-nowrap">Jabatan</th>
              <th className="p-3 sm:p-4 font-bold whitespace-nowrap">Status</th>
              {isAdmin && <th className="p-3 sm:p-4 font-bold text-center sm:rounded-tr-xl whitespace-nowrap">Aksi</th>}
            </tr>
          </thead>
          
          <tbody className="text-xs sm:text-sm text-slate-700">
            {isLoading ? (
              <tr><td colSpan={isAdmin ? 6 : 5} className="p-8 text-center text-slate-400 font-medium animate-pulse">Memuat data...</td></tr>
            ) : members.length === 0 ? (
              <tr><td colSpan={isAdmin ? 6 : 5} className="p-8 text-center text-slate-400">Belum ada data anggota.</td></tr>
            ) : (
              members.map((member, index) => (
                <tr key={member.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 sm:p-4 text-slate-400 font-medium whitespace-nowrap">{index + 1}</td>
                  <td className="p-3 sm:p-4 font-bold text-slate-800 whitespace-nowrap truncate max-w-[150px] sm:max-w-none">{member.nama}</td>
                  <td className="p-3 sm:p-4 whitespace-nowrap">{member.kelas}</td>
                  <td className="p-3 sm:p-4 whitespace-nowrap">{member.jabatan}</td>
                  <td className="p-3 sm:p-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${member.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {member.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="p-3 sm:p-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <button onClick={() => handleEditClick(member)} className="p-1.5 text-slate-400 hover:text-amber-500 bg-slate-50 hover:bg-amber-50 rounded-lg"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
                        <button onClick={() => handleHapusClick(member.id, member.nama)} className="p-1.5 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 rounded-lg"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* POP-UP FORM (Sama persis) */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100">
              <h3 className="font-bold text-base sm:text-lg text-slate-800">{editingId !== null ? "Edit Data" : "Tambah Baru"}</h3>
              <button onClick={resetDanTutupModal} className="text-slate-400 hover:text-rose-500 p-1"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <div className="p-4 sm:p-5">
              <form onSubmit={handleSimpanData} className="flex flex-col gap-3 sm:gap-4 mb-2">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Nama Lengkap</label>
                  <input type="text" required value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:border-[#007FA7] outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Kelas</label>
                    <select required value={formData.kelas} onChange={(e) => setFormData({...formData, kelas: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:border-[#007FA7] outline-none">
                      <option value="" disabled>Pilih</option><option value="X">X</option><option value="XI">XI</option><option value="XII">XII</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Jabatan</label>
                    <select value={formData.jabatan} onChange={(e) => setFormData({...formData, jabatan: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:border-[#007FA7] outline-none">
                      <option value="Anggota">Anggota</option><option value="Ketua">Ketua</option><option value="Sekretaris">Sekretaris</option><option value="Bendahara">Bendahara</option><option value="Ketua Bidang">Ketua Bidang</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
                  <button type="button" onClick={resetDanTutupModal} className="w-full sm:w-auto px-4 py-2 font-bold text-slate-500 bg-slate-100 rounded-xl text-xs sm:text-sm">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-4 py-2 font-bold text-white bg-[#003B9F] rounded-xl text-xs sm:text-sm">{isSubmitting ? "Menyimpan..." : "Simpan Data"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}