// File: app/dashboard/dokumentasi/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function DokumentasiPage() {
  const [galeriList, setGaleriList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // ================= 1. STATE BARU: Untuk Fitur Perbesar Foto =================
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ================= 2. STATE UNTUK SATPAM (ROLE CHECK) =================
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    judul: "",
    tanggal: ""
  });
  const [fileFoto, setFileFoto] = useState<File | null>(null);

  const fetchGaleri = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("materi_dokumentasi")
      .select("*")
      .eq("kategori", "Dokumentasi") 
      .order("tanggal", { ascending: false }); 

    if (!error) {
      setGaleriList(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === "admin@ipm.belik") {
        setIsAdmin(true);
      }
    };

    checkUserRole();
    fetchGaleri();
  }, []);

  const tutupModal = () => {
    setIsModalOpen(false);
    setFormData({ judul: "", tanggal: "" });
    setFileFoto(null);
  };

  // FUNGSI UPLOAD (HANYA ADMIN)
  const handleUploadFoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (!formData.judul || !formData.tanggal || !fileFoto) {
      return alert("Judul, Tanggal, dan File Foto wajib diisi!");
    }

    setIsUploading(true);

    try {
      const ekstensiFile = fileFoto.name.split('.').pop();
      const namaFileUnik = `foto-${Date.now()}.${ekstensiFile}`;

      const { error: uploadError } = await supabase.storage
        .from("dokumentasi")
        .upload(namaFileUnik, fileFoto);

      if (uploadError) throw new Error("Gagal mengunggah foto ke Storage: " + uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from("dokumentasi")
        .getPublicUrl(namaFileUnik);

      const urlFoto = publicUrlData.publicUrl;

      const { error: dbError } = await supabase
        .from("materi_dokumentasi")
        .insert([{
          kategori: "Dokumentasi",
          judul: formData.judul,
          tanggal: formData.tanggal,
          link_file: urlFoto
        }]);

      if (dbError) throw new Error("Gagal menyimpan data ke database: " + dbError.message);

      alert("Dokumentasi berhasil diunggah!");
      tutupModal();
      fetchGaleri(); 
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // FUNGSI HAPUS FOTO (HANYA ADMIN)
  const handleHapusFoto = async (id: number, judul: string, linkUrl: string) => {
    if (!isAdmin) return; 

    const confirmDelete = window.confirm(`Yakin ingin menghapus foto "${judul}"?`);
    if (!confirmDelete) return;

    const namaFile = linkUrl.split('/').pop();

    if (namaFile) {
      await supabase.storage.from("dokumentasi").remove([namaFile]);
    }

    const { error } = await supabase.from("materi_dokumentasi").delete().eq("id", id);
    if (!error) fetchGaleri();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-8 relative min-h-screen">
      
      <Link 
        href="/dashboard" 
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors mb-6 shadow-sm border border-purple-100 group"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">Galeri Dokumentasi</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Kumpulan rekam jejak visual kegiatan IPM.</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Unggah Foto
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-10"><p className="text-slate-400 font-medium animate-pulse">Memuat foto kegiatan...</p></div>
      ) : galeriList.length === 0 ? (
        <div className="bg-slate-50 p-12 text-center rounded-2xl border border-slate-200 border-dashed">
          <p className="text-slate-500 font-medium">Belum ada dokumentasi.</p>
          {isAdmin && <p className="text-xs text-slate-400 mt-1">Mulai unggah foto kegiatan pertamamu!</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galeriList.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-2xl border-2 border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all">
              
              {/* Gambar (Sekarang bisa diklik untuk diperbesar) */}
              <div 
                className="aspect-video w-full bg-slate-100 overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedImage(item.link_file)} // Saat diklik, simpan URL-nya ke state
              >
                <img 
                  src={item.link_file} 
                  alt={item.judul} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay Hitam Halus saat di-hover (menandakan bisa diklik) */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                
                {isAdmin && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Mencegah klik tombol hapus memicu perbesar foto
                      handleHapusFoto(item.id, item.judul, item.link_file);
                    }}
                    className="absolute top-2 right-2 bg-rose-500/90 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 z-10"
                    title="Hapus Foto"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                )}
              </div>

              {/* Info Foto */}
              <div className="p-4">
                <p className="text-[10px] font-extrabold text-purple-600 uppercase tracking-widest mb-1">{item.tanggal}</p>
                <h3 className="font-bold text-slate-800 line-clamp-2 leading-tight">{item.judul}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= FITUR BARU: POP-UP PERBESAR FOTO (LIGHTBOX) ================= */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-slate-900/90 backdrop-blur-md cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)} // Menutup pop-up saat mengklik area luar gambar
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center group">
            
            {/* Tombol Tutup (Silang) */}
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white p-2 transition-colors cursor-pointer"
              title="Tutup"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            
            {/* Gambar yang diperbesar */}
            <img 
              src={selectedImage} 
              alt="Preview Dokumentasi" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()} // Mencegah klik pada gambar ikut menutup pop-up
            />
          </div>
        </div>
      )}

      {/* POP-UP FORM UPLOAD (Hanya dirender jika Admin) */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-purple-50/50">
              <h3 className="font-extrabold text-lg text-purple-900">Unggah Dokumentasi</h3>
              <button onClick={tutupModal} className="text-slate-400 hover:text-rose-500 p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="p-5">
              <form onSubmit={handleUploadFoto} className="flex flex-col gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">File Foto</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required 
                    onChange={(e) => setFileFoto(e.target.files?.[0] || null)}
                    className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Judul Kegiatan</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Baksos Ranting 2026" 
                    value={formData.judul} 
                    onChange={(e) => setFormData({...formData, judul: e.target.value})} 
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-purple-500 outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Tanggal Kegiatan</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.tanggal} 
                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})} 
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-purple-500 outline-none" 
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={tutupModal} className="px-5 py-2.5 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm">Batal</button>
                  <button type="submit" disabled={isUploading} className="px-5 py-2.5 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl text-sm shadow-md disabled:opacity-70 flex items-center gap-2">
                    {isUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Mengunggah...
                      </>
                    ) : "Simpan Foto"}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}