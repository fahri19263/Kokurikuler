
export interface CoCurricularFormData {
  a1_namaKegiatan: string;
  a2_temaKegiatan: string;
  a3_penanggungJawab: string;
  a4_timGuru: string;
  a5_targetPeserta: string;
  a5_jenjangPendidikan: string;
  a6_tanggalMulai: string;
  a6_tanggalSelesai: string;
  a6_totalJP: string;
  a6_jadwalPelaksanaan: string;
  a7_lokasiKegiatan: string;
  b1_analisisKebutuhan: string;
  b1_dimensiProfil: string[];
  b1_tujuanSpesifik1: string;
  b1_tujuanSpesifik2: string;
  b1_tujuanSpesifik3: string;
  b2_keterkaitanAgama: string;
  b2_keterkaitanPancasila: string;
  b2_keterkaitanBahasaIndonesia: string;
  b2_keterkaitanBahasaInggris: string;
  b2_keterkaitanMatematika: string;
  b2_keterkaitanIPA: string;
  b2_keterkaitanIPS: string;
  b2_keterkaitanPJOK: string;
  b2_keterkaitanSeniBudaya: string;
  b2_keterkaitanInformatika: string;
  b3_tahapPersiapan: string;
  b3_tahapPelaksanaan: string;
  b3_tahapPenutupan: string;
  b4_anggaran: string;
  b4_saranaPrasarana: string;
  b4_mitraEksternal: string;
  c1_asesmenFormatifTeknik: string;
  c1_asesmenFormatifInstrumen: string;
  c1_asesmenSumatifTeknik: string;
  c1_asesmenSumatifInstrumen: string;
  c2_evaluasiProgram: string;
  d1_pelaporanOrtu: string;
  d1_pelaporanInternal: string;
  d2_tindakLanjutSiswa: string;
  d2_tindakLanjutProgram: string;
  e1_risiko1: string;
  e1_risiko2: string;
  e2_mitigasi1: string;
  e2_mitigasi2: string;
  e3_transportasi: string;
  e3_konsumsi: string;
  e3_perizinan: string;
  e3_komunikasi: string;
}

export interface HistoryItem {
  id: number;
  title: string;
  plan: string;
  formData: CoCurricularFormData;
}