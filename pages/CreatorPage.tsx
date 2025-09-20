
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CoCurricularFormData, HistoryItem } from '../types.ts';
import { FormSection } from '../components/FormSection.tsx';
import { InputField } from '../components/InputField.tsx';
import { TextareaField } from '../components/TextareaField.tsx';
import { CheckboxField } from '../components/CheckboxField.tsx';
import { SelectField } from '../components/SelectField.tsx';
import { GeneratedPlan } from '../components/GeneratedPlan.tsx';
import { HistoryPanel } from '../components/HistoryPanel.tsx';
import { LevelSelectionModal } from '../components/LevelSelectionModal.tsx';
import { ConfirmationModal } from '../components/ConfirmationModal.tsx';
import { Stepper } from '../components/Stepper.tsx';
import { SkeletonLoader } from '../components/SkeletonLoader.tsx';
import { generateCoCurricularPlan, getRecommendation } from '../services/geminiService.ts';
import { GRADUATE_PROFILE_DIMENSIONS, TOOLTIP_TEXTS } from '../constants.ts';
import { ProgressIndicator } from '../components/ProgressIndicator.tsx';

const initialState: CoCurricularFormData = {
  a1_namaKegiatan: '', a2_temaKegiatan: '', a3_penanggungJawab: '', a4_timGuru: '',
  a5_targetPeserta: '', a5_jenjangPendidikan: '', a6_tanggalMulai: '', a6_tanggalSelesai: '',
  a6_totalJP: '', a6_jadwalPelaksanaan: '', a7_lokasiKegiatan: '', b1_analisisKebutuhan: '',
  b1_dimensiProfil: [], b1_tujuanSpesifik1: '', b1_tujuanSpesifik2: '', b1_tujuanSpesifik3: '',
  b2_keterkaitanAgama: '', b2_keterkaitanPancasila: '', b2_keterkaitanBahasaIndonesia: '',
  b2_keterkaitanBahasaInggris: '', b2_keterkaitanMatematika: '', b2_keterkaitanIPA: '',
  b2_keterkaitanIPS: '', b2_keterkaitanPJOK: '', b2_keterkaitanSeniBudaya: '',
  b2_keterkaitanInformatika: '', b3_tahapPersiapan: '', b3_tahapPelaksanaan: '',
  b3_tahapPenutupan: '', b4_anggaran: '', b4_saranaPrasarana: '', b4_mitraEksternal: '',
  c1_asesmenFormatifTeknik: '', c1_asesmenFormatifInstrumen: '', c1_asesmenSumatifTeknik: '',
  c1_asesmenSumatifInstrumen: '', c2_evaluasiProgram: '', d1_pelaporanOrtu: '',
  d1_pelaporanInternal: '', d2_tindakLanjutSiswa: '', d2_tindakLanjutProgram: '',
  e1_risiko1: '', e1_risiko2: '', e2_mitigasi1: '', e2_mitigasi2: '', e3_transportasi: '',
  e3_konsumsi: '', e3_perizinan: '', e3_komunikasi: '',
};

const FORM_STEPS = [
    { number: 1, title: 'Informasi Dasar', id: 'A' },
    { number: 2, title: 'Perencanaan Inti', id: 'B1' },
    { number: 3, title: 'Alur Kegiatan', id: 'B2' },
    { number: 4, title: 'Sumber Daya', id: 'B3' },
    { number: 5, title: 'Asesmen & Evaluasi', id: 'C' },
    { number: 6, title: 'Pelaporan & Tindak Lanjut', id: 'D' },
    { number: 7, title: 'Manajemen Risiko', id: 'E' },
];

type ProcessingState = { active: boolean; title: string; };
interface CreatorPageProps { onNavigateHome: () => void; }

export const CreatorPage: React.FC<CreatorPageProps> = ({ onNavigateHome }) => {
  const [formData, setFormData] = useState<CoCurricularFormData>(initialState);
  const [generatedPlan, setGeneratedPlan] = useState<{plan: string, title: string} | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({ active: false, title: '' });
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(false);
  const [draftToRestore, setDraftToRestore] = useState<CoCurricularFormData | null>(null);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(false);
  
  // Refs for auto-scroll and auto-focus
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);
  const section7Ref = useRef<HTMLDivElement>(null);
  
  const firstInput1Ref = useRef<HTMLInputElement>(null);
  const firstInput2Ref = useRef<HTMLTextAreaElement>(null);
  const firstInput3Ref = useRef<HTMLTextAreaElement>(null);
  const firstInput4Ref = useRef<HTMLTextAreaElement>(null);
  const firstInput5Ref = useRef<HTMLTextAreaElement>(null);
  const firstInput6Ref = useRef<HTMLTextAreaElement>(null);
  const firstInput7Ref = useRef<HTMLTextAreaElement>(null);
  
  const lastInput1Ref = useRef<HTMLInputElement>(null);
  const lastInput2Ref = useRef<HTMLTextAreaElement>(null);
  const lastInput3Ref = useRef<HTMLTextAreaElement>(null);
  const lastInput4Ref = useRef<HTMLTextAreaElement>(null);
  const lastInput5Ref = useRef<HTMLTextAreaElement>(null);
  const lastInput6Ref = useRef<HTMLTextAreaElement>(null);
  const lastInput7Ref = useRef<HTMLTextAreaElement>(null);
  
  // FIX: Explicitly initialize useRef with undefined to avoid ambiguity in some TypeScript environments.
  const prevStepRef = useRef<number | undefined>(undefined);

  // Auto-save draft
  useEffect(() => {
    const handler = setTimeout(() => {
        const isFormEmpty = Object.values(formData).every(value => Array.isArray(value) ? value.length === 0 : value === '');
        if (!isFormEmpty) {
            localStorage.setItem('formDraft', JSON.stringify(formData));
        }
    }, 1000);
    return () => clearTimeout(handler);
  }, [formData]);

  // Check for draft on load
  useEffect(() => {
    try {
        const savedDraft = localStorage.getItem('formDraft');
        if (savedDraft) {
            setDraftToRestore(JSON.parse(savedDraft));
        }
        const savedHistory = localStorage.getItem('coCurricularHistory');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    } catch (e) {
        console.error("Failed to load data from localStorage", e);
    }
  }, []);
  
  // Bottom navigation visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsBottomNavVisible(true);
      } else {
        setIsBottomNavVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check in case the page loads scrolled (unlikely but safe)
    handleScroll(); 
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Auto-scroll and auto-focus on step change
  useEffect(() => {
    const sectionRefs = [section1Ref, section2Ref, section3Ref, section4Ref, section5Ref, section6Ref, section7Ref];
    const firstInputRefs = [firstInput1Ref, firstInput2Ref, firstInput3Ref, firstInput4Ref, firstInput5Ref, firstInput6Ref, firstInput7Ref];
    const lastInputRefs = [lastInput1Ref, lastInput2Ref, lastInput3Ref, lastInput4Ref, lastInput5Ref, lastInput6Ref, lastInput7Ref];

    const isNavigatingForward = prevStepRef.current === undefined || currentStep > prevStepRef.current;
    
    const sectionEl = sectionRefs[currentStep - 1]?.current;

    if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const focusTimeout = setTimeout(() => {
            const inputToFocus = isNavigatingForward
                ? firstInputRefs[currentStep - 1]?.current
                : lastInputRefs[currentStep - 1]?.current;

            if (inputToFocus) {
                inputToFocus.focus({ preventScroll: true });
            }
        }, 300); // Timeout to allow scroll to finish before focusing
        
        // This logic ensures the previous step is tracked correctly even in React.StrictMode
        const previousStepValue = prevStepRef.current;
        prevStepRef.current = currentStep;

        return () => {
            clearTimeout(focusTimeout);
            // On cleanup, restore the previous value. This makes the logic robust
            // against the double-invocation of effects in Strict Mode.
            prevStepRef.current = previousStepValue;
        };
    }
  }, [currentStep]);

  const restoreDraft = () => {
    if (draftToRestore) {
      setFormData(draftToRestore);
      setDraftToRestore(null);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('formDraft');
    setDraftToRestore(null);
  };

  const updateHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('coCurricularHistory', JSON.stringify(newHistory));
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // If start date changes and is now after the end date, reset end date.
      if (name === 'a6_tanggalMulai' && prev.a6_tanggalSelesai && value > prev.a6_tanggalSelesai) {
        newData.a6_tanggalSelesai = '';
      }
      return newData;
    });
  }, []);

  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      b1_dimensiProfil: checked ? [...prev.b1_dimensiProfil, name] : prev.b1_dimensiProfil.filter(item => item !== name),
    }));
  }, []);

  const handleGetRecommendation = async (level: string, query: string) => {
    setIsLevelModalOpen(false);
    setIsSkeletonLoading(true);
    setError('');
    try {
      const recommendation = await getRecommendation(level, query);
      setFormData(recommendation);
      setCurrentStep(1);
    } catch (err) {
      setError(err instanceof Error ? `Gagal mendapatkan rekomendasi: ${err.message}` : 'Terjadi kesalahan.');
    } finally {
      setIsSkeletonLoading(false);
    }
  };

  const handleSubmit = async () => {
    setProcessingState({ active: true, title: 'Menciptakan Rencana...' });
    setError('');
    setGeneratedPlan(null);
    try {
      const plan = await generateCoCurricularPlan(formData);
      setGeneratedPlan({plan, title: formData.a1_namaKegiatan});
      const newHistoryItem: HistoryItem = { id: Date.now(), title: formData.a1_namaKegiatan, plan, formData };
      updateHistory([newHistoryItem, ...history.slice(0, 9)]);
      localStorage.removeItem('formDraft');
    } catch (err) {
      setError(err instanceof Error ? `Gagal membuat rencana: ${err.message}` : 'Terjadi kesalahan.');
    } finally {
      setProcessingState({ active: false, title: '' });
    }
  };
  
  const handleConfirmClear = () => {
    setFormData(initialState);
    setCurrentStep(1);
    localStorage.removeItem('formDraft');
    setIsConfirmModalOpen(false);
  };
  
  const handleViewHistory = (item: HistoryItem) => setGeneratedPlan({ plan: item.plan, title: item.title });
  const handleDeleteHistory = (id: number) => updateHistory(history.filter(item => item.id !== id));
  const handleReloadHistory = (formDataToReload: CoCurricularFormData) => {
    setFormData(formDataToReload);
    setCurrentStep(1);
  };

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const isFormEmpty = Object.values(formData).every(value => Array.isArray(value) ? value.length === 0 : value === '');

  const renderCurrentStep = () => {
    if (isSkeletonLoading) {
        return <SkeletonLoader />;
    }
    const today = new Date().toISOString().split('T')[0];

    switch(currentStep) {
        case 1:
            return <FormSection ref={section1Ref} title="A. Informasi Dasar Kegiatan">
                <InputField ref={firstInput1Ref} label="Nama Kegiatan" name="a1_namaKegiatan" value={formData.a1_namaKegiatan} onChange={handleChange} tooltipText={TOOLTIP_TEXTS.a1_namaKegiatan} />
                <TextareaField label="Tema Kegiatan" name="a2_temaKegiatan" value={formData.a2_temaKegiatan} onChange={handleChange} rows={3} tooltipText={TOOLTIP_TEXTS.a2_temaKegiatan} />
                <InputField label="Penanggung Jawab" name="a3_penanggungJawab" value={formData.a3_penanggungJawab} onChange={handleChange} />
                <InputField label="Tim Guru Terlibat" name="a4_timGuru" value={formData.a4_timGuru} onChange={handleChange} tooltipText={TOOLTIP_TEXTS.a4_timGuru} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Target Peserta" name="a5_targetPeserta" value={formData.a5_targetPeserta} onChange={handleChange} />
                     <SelectField label="Jenjang Pendidikan" name="a5_jenjangPendidikan" value={formData.a5_jenjangPendidikan} onChange={handleChange} options={[
                        {value: "PAUD", label: "PAUD/TK"}, {value: "SD", label: "SD"}, {value: "SMP", label: "SMP"}, {value: "SMA", label: "SMA"}, {value: "SMK", label: "SMK"}
                    ]} placeholder="Pilih Jenjang" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Tanggal Mulai" name="a6_tanggalMulai" value={formData.a6_tanggalMulai} onChange={handleChange} type="date" min={today} />
                    <InputField label="Tanggal Selesai" name="a6_tanggalSelesai" value={formData.a6_tanggalSelesai} onChange={handleChange} type="date" min={formData.a6_tanggalMulai || today} />
                </div>
                <InputField label="Total Durasi (JP)" name="a6_totalJP" value={formData.a6_totalJP} onChange={handleChange} tooltipText={TOOLTIP_TEXTS.a6_totalJP} />
                <TextareaField label="Jadwal Pelaksanaan" name="a6_jadwalPelaksanaan" value={formData.a6_jadwalPelaksanaan} onChange={handleChange} rows={3} />
                <InputField ref={lastInput1Ref} label="Lokasi Kegiatan" name="a7_lokasiKegiatan" value={formData.a7_lokasiKegiatan} onChange={handleChange} />
            </FormSection>;
        case 2:
            return <FormSection ref={section2Ref} title="B. Perencanaan Inti">
                <TextareaField ref={firstInput2Ref} label="Latar Belakang & Analisis Kebutuhan" name="b1_analisisKebutuhan" value={formData.b1_analisisKebutuhan} onChange={handleChange} rows={8} tooltipText={TOOLTIP_TEXTS.b1_analisisKebutuhan} />
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Dimensi Profil Lulusan</label>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                        {GRADUATE_PROFILE_DIMENSIONS.map(d => <CheckboxField key={d} label={d} name={d} checked={formData.b1_dimensiProfil.includes(d)} onChange={handleCheckboxChange} />)}
                    </div>
                </div>
                <TextareaField label="Tujuan Spesifik 1" name="b1_tujuanSpesifik1" value={formData.b1_tujuanSpesifik1} onChange={handleChange} rows={3} tooltipText={TOOLTIP_TEXTS.b1_tujuanSpesifik} />
                <TextareaField label="Tujuan Spesifik 2" name="b1_tujuanSpesifik2" value={formData.b1_tujuanSpesifik2} onChange={handleChange} rows={3} />
                <TextareaField label="Tujuan Spesifik 3" name="b1_tujuanSpesifik3" value={formData.b1_tujuanSpesifik3} onChange={handleChange} rows={3} />
                <h3 className="text-lg font-medium text-slate-800 pt-4 border-t">Keterkaitan Lintas Disiplin Ilmu</h3>
                <TextareaField label="Agama & Budi Pekerti" name="b2_keterkaitanAgama" value={formData.b2_keterkaitanAgama} onChange={handleChange} tooltipText={TOOLTIP_TEXTS.b2_keterkaitanMapel} />
                <TextareaField label="Pancasila" name="b2_keterkaitanPancasila" value={formData.b2_keterkaitanPancasila} onChange={handleChange} />
                <TextareaField label="Bahasa Indonesia" name="b2_keterkaitanBahasaIndonesia" value={formData.b2_keterkaitanBahasaIndonesia} onChange={handleChange} />
                <TextareaField label="Bahasa Inggris" name="b2_keterkaitanBahasaInggris" value={formData.b2_keterkaitanBahasaInggris} onChange={handleChange} />
                <TextareaField label="Matematika" name="b2_keterkaitanMatematika" value={formData.b2_keterkaitanMatematika} onChange={handleChange} />
                <TextareaField label="IPA" name="b2_keterkaitanIPA" value={formData.b2_keterkaitanIPA} onChange={handleChange} />
                <TextareaField label="IPS" name="b2_keterkaitanIPS" value={formData.b2_keterkaitanIPS} onChange={handleChange} />
                <TextareaField label="PJOK" name="b2_keterkaitanPJOK" value={formData.b2_keterkaitanPJOK} onChange={handleChange} />
                <TextareaField label="Seni Budaya" name="b2_keterkaitanSeniBudaya" value={formData.b2_keterkaitanSeniBudaya} onChange={handleChange} />
                <TextareaField ref={lastInput2Ref} label="Informatika" name="b2_keterkaitanInformatika" value={formData.b2_keterkaitanInformatika} onChange={handleChange} />
            </FormSection>;
        case 3:
            return <FormSection ref={section3Ref} title="B. Alur Kegiatan">
                <TextareaField ref={firstInput3Ref} label="Tahap Persiapan" name="b3_tahapPersiapan" value={formData.b3_tahapPersiapan} onChange={handleChange} rows={6} />
                <TextareaField label="Tahap Pelaksanaan" name="b3_tahapPelaksanaan" value={formData.b3_tahapPelaksanaan} onChange={handleChange} rows={6} />
                <TextareaField ref={lastInput3Ref} label="Tahap Penutupan" name="b3_tahapPenutupan" value={formData.b3_tahapPenutupan} onChange={handleChange} rows={6} />
            </FormSection>;
        case 4:
            return <FormSection ref={section4Ref} title="B. Kebutuhan Sumber Daya">
                <TextareaField ref={firstInput4Ref} label="Anggaran" name="b4_anggaran" value={formData.b4_anggaran} onChange={handleChange} tooltipText={TOOLTIP_TEXTS.b4_anggaran} />
                <TextareaField label="Sarana & Prasarana" name="b4_saranaPrasarana" value={formData.b4_saranaPrasarana} onChange={handleChange} />
                <TextareaField ref={lastInput4Ref} label="Mitra Eksternal" name="b4_mitraEksternal" value={formData.b4_mitraEksternal} onChange={handleChange} tooltipText={TOOLTIP_TEXTS.b4_mitraEksternal} />
            </FormSection>;
        case 5:
            return <FormSection ref={section5Ref} title="C. Asesmen dan Evaluasi">
                <TextareaField ref={firstInput5Ref} label="Teknik Asesmen Formatif" name="c1_asesmenFormatifTeknik" value={formData.c1_asesmenFormatifTeknik} onChange={handleChange} tooltipText={TOOLTIP_TEXTS.c1_asesmenFormatifTeknik} />
                <TextareaField label="Instrumen Asesmen Formatif" name="c1_asesmenFormatifInstrumen" value={formData.c1_asesmenFormatifInstrumen} onChange={handleChange} />
                <TextareaField label="Teknik Asesmen Sumatif" name="c1_asesmenSumatifTeknik" value={formData.c1_asesmenSumatifTeknik} onChange={handleChange} tooltipText={TOOLTIP_TEXTS.c1_asesmenSumatifTeknik} />
                <TextareaField label="Instrumen Asesmen Sumatif" name="c1_asesmenSumatifInstrumen" value={formData.c1_asesmenSumatifInstrumen} onChange={handleChange} />
                <TextareaField ref={lastInput5Ref} label="Evaluasi Keberhasilan Program" name="c2_evaluasiProgram" value={formData.c2_evaluasiProgram} onChange={handleChange} rows={6} tooltipText={TOOLTIP_TEXTS.c2_evaluasiProgram} />
            </FormSection>;
        case 6:
            return <FormSection ref={section6Ref} title="D. Pelaporan dan Tindak Lanjut">
                <TextareaField ref={firstInput6Ref} label="Pelaporan kpd Ortu/Siswa" name="d1_pelaporanOrtu" value={formData.d1_pelaporanOrtu} onChange={handleChange} />
                <TextareaField label="Pelaporan Internal Sekolah" name="d1_pelaporanInternal" value={formData.d1_pelaporanInternal} onChange={handleChange} />
                <TextareaField label="Tindak Lanjut untuk Siswa" name="d2_tindakLanjutSiswa" value={formData.d2_tindakLanjutSiswa} onChange={handleChange} rows={6} />
                <TextareaField ref={lastInput6Ref} label="Tindak Lanjut untuk Program" name="d2_tindakLanjutProgram" value={formData.d2_tindakLanjutProgram} onChange={handleChange} rows={6} />
            </FormSection>;
        case 7:
            return <FormSection ref={section7Ref} title="E. Manajemen Risiko dan Logistik">
                <TextareaField ref={firstInput7Ref} label="Potensi Risiko 1" name="e1_risiko1" value={formData.e1_risiko1} onChange={handleChange} tooltipText={TOOLTIP_TEXTS.e1_risiko} />
                <TextareaField label="Mitigasi Risiko 1" name="e2_mitigasi1" value={formData.e2_mitigasi1} onChange={handleChange} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextareaField label="Potensi Risiko 2" name="e1_risiko2" value={formData.e1_risiko2} onChange={handleChange} />
                    <TextareaField label="Mitigasi Risiko 2" name="e2_mitigasi2" value={formData.e2_mitigasi2} onChange={handleChange} />
                </div>
                <h3 className="text-lg font-medium text-slate-800 pt-4 border-t">Detail Logistik</h3>
                <TextareaField label="Transportasi" name="e3_transportasi" value={formData.e3_transportasi} onChange={handleChange} />
                <TextareaField label="Konsumsi" name="e3_konsumsi" value={formData.e3_konsumsi} onChange={handleChange} />
                <TextareaField label="Perizinan" name="e3_perizinan" value={formData.e3_perizinan} onChange={handleChange} />
                <TextareaField ref={lastInput7Ref} label="Komunikasi" name="e3_komunikasi" value={formData.e3_komunikasi} onChange={handleChange} />
            </FormSection>;
        default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {processingState.active && <ProgressIndicator title={processingState.title} />}
      <LevelSelectionModal isOpen={isLevelModalOpen} onClose={() => setIsLevelModalOpen(false)} onSelect={handleGetRecommendation} />
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleConfirmClear} title="Hapus Isian Formulir" message="Apakah Anda yakin ingin membersihkan semua data yang telah diisi? Tindakan ini tidak dapat diurungkan." />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-grow w-full pb-32" style={{scrollBehavior: 'smooth'}}>
        <header className="relative text-center mb-10">
            <button onClick={onNavigateHome} className="absolute left-0 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Beranda
            </button>
          <h1 className="text-4xl font-bold text-indigo-800 tracking-tight">Alat Perancang Kegiatan</h1>
          <p className="mt-2 text-lg text-slate-600">Isi formulir di bawah ini atau dapatkan inspirasi dari AI.</p>
        </header>

        {draftToRestore && (
            <div className="mb-6 bg-orange-100 border border-orange-400 text-orange-800 px-4 py-3 rounded-lg flex items-center justify-between gap-4">
                <div>
                    <strong className="font-bold">Draf Ditemukan!</strong>
                    <span className="block sm:inline ml-2">Anda memiliki sesi yang belum selesai.</span>
                </div>
                <div>
                    <button onClick={restoreDraft} className="font-semibold bg-orange-200 px-3 py-1 rounded-md text-sm mr-2">Pulihkan</button>
                    <button onClick={clearDraft} className="font-semibold text-slate-600 px-3 py-1 text-sm">Abaikan</button>
                </div>
            </div>
        )}
        
        <HistoryPanel history={history} onView={handleViewHistory} onDelete={handleDeleteHistory} onReload={handleReloadHistory} />

        <div className="mb-8 p-4 bg-white rounded-lg shadow-md border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
                <h3 className="font-semibold text-indigo-800">Butuh Inspirasi Cepat?</h3>
                <p className="text-sm text-slate-500">Biarkan AI mengisi seluruh draf rencana untuk Anda.</p>
            </div>
            <button type="button" onClick={() => setIsLevelModalOpen(true)} disabled={processingState.active || isSkeletonLoading} className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 transition-transform hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Beri Aku Ide
            </button>
        </div>

        {error && <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">{error}</div>}

        <div className="space-y-10">
            <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-sm py-4 -my-4">
                <Stepper 
                    currentStep={currentStep} 
                    totalSteps={FORM_STEPS.length} 
                    steps={FORM_STEPS.map(s => s.title)}
                    onStepClick={handleStepClick}
                />
            </div>
            
            <div className="min-h-[400px]">
                {renderCurrentStep()}
            </div>
        </div>

        {generatedPlan && <GeneratedPlan plan={generatedPlan.plan} title={generatedPlan.title} onClose={() => setGeneratedPlan(null)} />}
      </main>

      <div className={`sticky bottom-0 z-20 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out ${
          isBottomNavVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center gap-4">
                <div>
                    {currentStep > 1 && (
                        <button type="button" onClick={() => setCurrentStep(s => s - 1)} className="px-4 py-2 sm:px-6 sm:py-2.5 text-sm font-medium rounded-md text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors">
                            Sebelumnya
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button type="button" onClick={() => setIsConfirmModalOpen(true)} disabled={isFormEmpty || processingState.active} className="px-4 py-2 sm:px-6 sm:py-2.5 text-sm font-medium rounded-md text-slate-700 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors">
                        Hapus Isian
                    </button>
                    {currentStep < FORM_STEPS.length ? (
                        <button type="button" onClick={() => setCurrentStep(s => s + 1)} className="w-full sm:w-auto inline-flex justify-center py-2 px-6 sm:py-2.5 sm:px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-105">
                            Selanjutnya
                        </button>
                    ) : (
                        <button type="button" onClick={handleSubmit} disabled={processingState.active || isFormEmpty} className="w-full sm:w-auto inline-flex justify-center py-2 px-6 sm:py-2.5 sm:px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-transform hover:scale-105">
                            {processingState.active ? 'Memproses...' : 'Ciptakan Rencana'}
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};