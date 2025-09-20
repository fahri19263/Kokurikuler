
import { GoogleGenAI, Type } from "@google/genai";
import type { CoCurricularFormData } from '../types.ts';
import { GRADUATE_PROFILE_DIMENSIONS } from '../constants.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recommendationSchema = {
    type: Type.OBJECT,
    properties: {
        a1_namaKegiatan: { type: Type.STRING, description: "Nama kegiatan yang menarik dan kreatif." },
        a2_temaKegiatan: { type: Type.STRING, description: "Tema utama dari kegiatan." },
        a3_penanggungJawab: { type: Type.STRING, description: "Jabatan atau peran yang bertanggung jawab, misal 'Koordinator Kesiswaan'." },
        a4_timGuru: { type: Type.STRING, description: "Contoh nama guru atau bidang studi guru yang terlibat, misal 'Guru IPA dan Seni Budaya'." },
        a5_targetPeserta: { type: Type.STRING, description: "Kelompok siswa yang menjadi target, misal 'Siswa Kelas 7 dan 8'." },
        a5_jenjangPendidikan: { type: Type.STRING, description: "Jenjang pendidikan yang paling sesuai untuk kegiatan ini (PAUD, SD, SMP, SMA, atau SMK)." },
        a6_tanggalMulai: { type: Type.STRING, description: "Tanggal mulai hipotetis dalam format YYYY-MM-DD." },
        a6_tanggalSelesai: { type: Type.STRING, description: "Tanggal selesai hipotetis dalam format YYYY-MM-DD." },
        a6_totalJP: { type: Type.STRING, description: "Total Jam Pelajaran (JP) yang dialokasikan." },
        a6_jadwalPelaksanaan: { type: Type.STRING, description: "Deskripsi singkat jadwal, misal 'Setiap hari Jumat, pukul 14.00-16.00'." },
        a7_lokasiKegiatan: { type: Type.STRING, description: "Lokasi pelaksanaan kegiatan." },
        b1_analisisKebutuhan: { type: Type.STRING, description: "Analisis singkat kebutuhan siswa yang mendasari kegiatan ini." },
        b1_dimensiProfil: {
            type: Type.ARRAY,
            description: `Pilih beberapa dimensi yang paling relevan dari daftar yang diberikan.`,
            items: { type: Type.STRING }
        },
        b1_tujuanSpesifik1: { type: Type.STRING, description: "Tujuan spesifik pertama yang ingin dicapai." },
        b1_tujuanSpesifik2: { type: Type.STRING, description: "Tujuan spesifik kedua." },
        b1_tujuanSpesifik3: { type: Type.STRING, description: "Tujuan spesifik ketiga." },
        b2_keterkaitanAgama: { type: Type.STRING, description: "Keterkaitan kegiatan dengan mata pelajaran Agama." },
        b2_keterkaitanPancasila: { type: Type.STRING, description: "Keterkaitan kegiatan dengan mata pelajaran Pancasila." },
        b2_keterkaitanBahasaIndonesia: { type: Type.STRING, description: "Keterkaitan kegiatan dengan mata pelajaran Bahasa Indonesia." },
        b2_keterkaitanBahasaInggris: { type: Type.STRING, description: "Keterkaitan kegiatan dengan mata pelajaran Bahasa Inggris." },
        b2_keterkaitanMatematika: { type: Type.STRING, description: "Keterkaitan kegiatan dengan mata pelajaran Matematika." },
        b2_keterkaitanIPA: { type: Type.STRING, description: "Keterkaitan kegiatan dengan mata pelajaran IPA." },
        b2_keterkaitanIPS: { type: Type.STRING, description: "Keterkaitan kegiatan dengan mata pelajaran IPS." },
        b2_keterkaitanPJOK: { type: Type.STRING, description: "Keterkaitan kegiatan dengan mata pelajaran PJOK." },
        b2_keterkaitanSeniBudaya: { type: Type.STRING, description: "Keterkaitan kegiatan dengan mata pelajaran Seni Budaya." },
        b2_keterkaitanInformatika: { type: Type.STRING, description: "Keterkaitan kegiatan dengan mata pelajaran Informatika." },
        b3_tahapPersiapan: { type: Type.STRING, description: "Langkah-langkah persiapan sebelum kegiatan." },
        b3_tahapPelaksanaan: { type: Type.STRING, description: "Rangkaian aktivitas inti selama kegiatan." },
        b3_tahapPenutupan: { type: Type.STRING, description: "Kegiatan penutupan dan refleksi setelah acara." },
        b4_anggaran: { type: Type.STRING, description: "Estimasi singkat sumber dan alokasi dana." },
        b4_saranaPrasarana: { type: Type.STRING, description: "Sarana dan prasarana yang dibutuhkan." },
        b4_mitraEksternal: { type: Type.STRING, description: "Pihak eksternal yang bisa diajak kerjasama." },
        c1_asesmenFormatifTeknik: { type: Type.STRING, description: "Teknik asesmen formatif yang digunakan." },
        c1_asesmenFormatifInstrumen: { type: Type.STRING, description: "Contoh instrumen untuk asesmen formatif." },
        c1_asesmenSumatifTeknik: { type: Type.STRING, description: "Teknik asesmen sumatif di akhir kegiatan." },
        c1_asesmenSumatifInstrumen: { type: Type.STRING, description: "Contoh instrumen untuk asesmen sumatif." },
        c2_evaluasiProgram: { type: Type.STRING, description: "Cara mengevaluasi keberhasilan program secara keseluruhan." },
        d1_pelaporanOrtu: { type: Type.STRING, description: "Bentuk pelaporan hasil kegiatan kepada orang tua." },
        d1_pelaporanInternal: { type: Type.STRING, description: "Bentuk pelaporan untuk internal sekolah." },
        d2_tindakLanjutSiswa: { type: Type.STRING, description: "Rencana tindak lanjut untuk pengembangan siswa." },
        d2_tindakLanjutProgram: { type: Type.STRING, description: "Rencana tindak lanjut untuk perbaikan program di masa depan." },
        e1_risiko1: { type: Type.STRING, description: "Identifikasi potensi risiko pertama." },
        e1_risiko2: { type: Type.STRING, description: "Identifikasi potensi risiko kedua." },
        e2_mitigasi1: { type: Type.STRING, description: "Cara mitigasi untuk risiko pertama." },
        e2_mitigasi2: { type: Type.STRING, description: "Cara mitigasi untuk risiko kedua." },
        e3_transportasi: { type: Type.STRING, description: "Rencana logistik transportasi." },
        e3_konsumsi: { type: Type.STRING, description: "Rencana logistik konsumsi." },
        e3_perizinan: { type: Type.STRING, description: "Jenis perizinan yang mungkin diperlukan." },
        e3_komunikasi: { type: Type.STRING, description: "Strategi komunikasi selama kegiatan." },
    }
};

export const getRecommendation = async (level: string, userInput: string): Promise<CoCurricularFormData> => {
    try {
        let systemInstruction = "Anda adalah seorang perancang kurikulum yang sangat kreatif dan inovatif.";
        
        let userIdeaPrompt = '';
        if (userInput && userInput.trim() !== '') {
            userIdeaPrompt = `
PENTING: Gunakan ide atau kata kunci dari pengguna berikut sebagai inspirasi utama untuk menghasilkan proposal. Jangan menyimpang terlalu jauh dari ide ini.
Ide dari Pengguna: "${userInput.trim()}"
`;
        }

        let userPrompt = `Buatlah sebuah ide proposal lengkap untuk kegiatan kokurikuler di sekolah untuk jenjang pendidikan: **${level}**.
        
${userIdeaPrompt}

        Ide ini harus mendidik, menarik, relevan dengan tantangan abad ke-21, dan sesuai dengan tahap perkembangan siswa di jenjang ${level}. Fokus pada pengembangan soft skills siswa.

        Pastikan untuk mengisi semua detail yang diperlukan dalam format JSON sesuai skema yang diberikan.
        PENTING: Pastikan properti 'a5_jenjangPendidikan' dalam JSON diisi dengan nilai '${level}'.
        
        Untuk dimensi profil lulusan (b1_dimensiProfil), pilih beberapa dari daftar berikut: ${GRADUATE_PROFILE_DIMENSIONS.join(', ')}.
        `;
        
        if (level === 'PAUD') {
            systemInstruction = "Anda adalah seorang guru PAUD yang penuh kasih, kreatif, dan ahli dalam pembelajaran berbasis bermain.";
            userPrompt = `Buatlah ide kegiatan kokurikuler yang sangat sederhana, menyenangkan, dan fokus pada eksplorasi sensorik untuk anak-anak **PAUD**.
${userIdeaPrompt}
Kegiatan harus aman, melibatkan banyak gerakan dan permainan, serta memperkenalkan konsep dasar seperti warna, bentuk, atau suara. Contoh tema: "Petualangan di Kebun Binatang Ajaib" atau "Festival Warna-Warni". Isi JSON dengan bahasa yang sederhana. Pastikan 'a5_jenjangPendidikan' diisi dengan 'PAUD'. Untuk dimensi profil lulusan (b1_dimensiProfil), pilih beberapa dari daftar berikut: ${GRADUATE_PROFILE_DIMENSIONS.join(', ')}.`;
        } else if (level === 'SD') {
             systemInstruction = "Anda adalah seorang guru SD yang sangat kreatif, ahli dalam gamifikasi, dan memahami cara membuat pembelajaran menjadi sebuah petualangan yang menyenangkan.";
             userPrompt = `Buatlah sebuah ide proposal kegiatan kokurikuler yang **sangat menyenangkan, imajinatif, dan penuh permainan** untuk siswa jenjang **Sekolah Dasar (SD)**. Ide ini harus terasa seperti sebuah petualangan atau festival, bukan pelajaran biasa.

${userIdeaPrompt}

Jika pengguna tidak memberikan ide, **pilih salah satu dari TIGA TEMA PETUALANGAN berikut sebagai dasar ide Anda:**

1.  **"MISI DETEKTIF CILIK" (Petualangan Berbasis Penemuan):** Rancang sebuah kegiatan di mana siswa menjadi detektif yang memecahkan sebuah misteri di lingkungan sekolah. Misalnya, "Misteri Hilangnya Tanaman Ajaib di Taman Sekolah". Misi ini akan melibatkan siswa untuk mengamati (Penalaran Kritis), bekerja sama (Kolaborasi), berkreasi (Kreativitas), dan belajar tentang lingkungan (Kewargaan).

2.  **"FESTIVAL KARYA NUSANTARA" (Perayaan Kreativitas dan Budaya):** Rancang sebuah event besar di sekolah yang berfokus pada kekayaan budaya Indonesia. Siswa akan mempersiapkan dan menampilkan pentas dongeng (Komunikasi), pameran permainan tradisional (Kesehatan & Kolaborasi), dan pasar jajanan lokal (Kemandirian).

3.  **"AKADEMI PAHLAWAN SUPER KAIH" (Pembiasaan Baik yang Seru):** Ubah **7 KAIH** (Bangun Pagi, Beribadah, Berolahraga, Makan Sehat, Gemar Belajar, Bermasyarakat, Tidur Cepat) menjadi sebuah "akademi" di mana siswa mengumpulkan "Kekuatan Super". Buat sistem misi dan lencana yang seru untuk memotivasi pembentukan karakter.

**Instruksi PENTING:**
- **BAHASA ANAK-ANAK:** Gunakan nama dan deskripsi yang mudah dipahami dan menarik bagi anak-anak SD.
- **FOKUS PADA PERMAINAN:** Jelaskan di bagian analisis kebutuhan mengapa pendekatan berbasis permainan ini efektif untuk perkembangan mereka.
- **LENGKAPI JSON:** Isi semua field JSON dengan detail yang imajinatif dan cocok untuk anak-anak.
- **WAJIB:** Pastikan properti 'a5_jenjangPendidikan' dalam JSON diisi dengan nilai 'SD'.
- **DIMENSI PROFIL:** Untuk dimensi profil lulusan (b1_dimensiProfil), pilih beberapa yang paling relevan dari daftar berikut: ${GRADUATE_PROFILE_DIMENSIONS.join(', ')}.
`;
        } else if (['SMP', 'SMA', 'SMK'].includes(level)) {
            systemInstruction = "Anda adalah seorang perancang kurikulum yang visioner, memahami psikologi remaja, dan ahli dalam membuat kegiatan yang relevan, berdampak, dan menyenangkan.";
            userPrompt = `Buatlah sebuah ide proposal kegiatan kokurikuler yang **kreatif, out-of-the-box, dan sangat menarik** untuk siswa jenjang **${level}**. Ide ini harus selaras dengan perkembangan siswa dan terasa seperti sebuah proyek nyata atau petualangan, bukan pelajaran tambahan.

${userIdeaPrompt}

Jika pengguna tidak memberikan ide, **pilih salah satu dari EMPAT TEMA INSPIRASI UTAMA berikut sebagai dasar ide Anda:**

1.  **"7 KAIH CHALLENGE" (Gerakan Pembiasaan Positif):** Rancang sebuah kampanye atau *quest* sekolah selama sebulan penuh yang didasarkan pada **7 KAIH** (Bangun Pagi, Beribadah, Berolahraga, Makan Sehat, Gemar Belajar, Bermasyarakat, Tidur Cepat). Buatlah ini menjadi sebuah permainan (*gamified*). Beri nama yang sangat keren (contoh: "The KAIH Supremacy Quest" atau "7-Day Hero Challenge") dan rancang aktivitas harian/mingguan yang seru, memiliki sistem poin, dan mungkin ada *reward* di akhir. Fokus pada pembentukan karakter melalui kebiasaan baik yang menyenangkan.

2.  **"SKILL UNLOCKED" (Petualangan Lintas Minat):** Rancang sebuah kegiatan yang terasa seperti *event* atau festival, bukan proyek akademis, yang berfokus pada pengembangan *soft skills* yang relevan dengan dunia remaja. Contohnya bisa seperti "Creator Camp" (mengasah skill komunikasi dan kreativitas melalui pembuatan konten digital), "Mystery Box Challenge" (mengasah penalaran kritis dan kolaborasi untuk memecahkan masalah dengan alat terbatas), atau "School Escape Room" (merancang dan menjalankan *escape room* sendiri).

3.  **"ENTREPRENEUR & EXPLORER" (Wirausaha dan Penjelajah):** Rancang sebuah proyek berbasis dunia nyata yang berfokus pada kewirausahaan atau eksplorasi ilmiah.
    *   **Opsi A (Young Entrepreneurs Challenge):** Buat proposal untuk sebuah program di mana siswa, dalam tim, mengembangkan ide produk/jasa, membuat rencana bisnis sederhana, memproduksinya (bisa berupa produk digital atau fisik), dan menjualnya pada sebuah "Market Day" di sekolah. Fokus pada dimensi Kreativitas, Kolaborasi, dan Kemandirian.
    *   **Opsi B (Ekspedisi Ilmiah Geopark Belitung):** Buat proposal untuk sebuah *study tour* multidisiplin ke **Geopark Belitung**. Rencana harus mencakup kunjungan ke beberapa geosite kunci seperti **Geosite Gunung Lumut (hutan kerangas), Open Pit Nam Salu (sejarah timah), Geosite Tanjung Kelayang (formasi granit), dan pengenalan Batu Satam (tektit)**. Jelaskan bagaimana kegiatan ini akan mengintegrasikan mata pelajaran IPA (Geologi), IPS (Sejarah pertambangan, ekonomi pariwisata), Seni Budaya (Fotografi lanskap), dan Kewargaan (Konservasi).
    
4.  **"DIMENSION EXPLORER" (Eksplorasi Profil Lulusan):** Pilih salah satu dari 8 Dimensi Profil Lulusan dan rancang sebuah kegiatan yang sangat mendalam dan berdampak berdasarkan contoh-contoh inspirasi yang ada. Buatlah proposal yang detail dan kreatif berdasarkan salah satu contoh di bawah ini:
    *   **Keimanan & Ketakwaan:** Program Mentoring Keagamaan, Retret Spiritual, Lomba Kreatif Hari Besar Keagamaan.
    *   **Kewargaan:** Simulasi Sidang Parlemen Remaja, Proyek "Desa Binaan", Festival Budaya Nusantara.
    *   **Penalaran Kritis:** Klub Debat Isu Global, Proyek Investigasi "Fact-Checking" Hoax, Kompetisi "Mystery Box Challenge".
    *   **Kreativitas:** Hackathon Cipta Aplikasi, Proyek Film Pendek, Workshop Daur Ulang, "Creator Camp" konten digital.
    *   **Kolaborasi:** Proyek Teater Musikal, Membangun Model Kota Masa Depan, Menyelenggarakan Acara Amal.
    *   **Kemandirian:** "Young Entrepreneurs Market Day", Proyek Riset Individual, Program "Life Skills".
    *   **Kesehatan:** Kampanye "Wellness Week", Olimpiade Olahraga Tradisional, Program "Duta Anti-Narkoba".
    *   **Komunikasi:** Klub "Public Speaking", Program Podcast Sekolah, Pelatihan Jurnalis Sekolah.

**Instruksi PENTING:**
- **NAMA KEREN:** Nama kegiatan harus terdengar modern dan menarik bagi siswa.
- **ASPEK KESENANGAN & RELEVANSI:** Jelaskan dengan jelas di bagian analisis kebutuhan mengapa kegiatan ini akan terasa menyenangkan dan relevan dengan dunia mereka.
- **HINDARI IDE GENERIC:** Jangan menyarankan ide yang terlalu umum. Jika memilih tema lingkungan, kemas dengan cara yang unik dan aplikatif.
- **LENGKAPI JSON:** Isi semua field JSON dengan detail yang kreatif dan relevan dengan tema inspirasi yang Anda pilih.
- **WAJIB:** Pastikan properti 'a5_jenjangPendidikan' dalam JSON diisi dengan nilai '${level}'.
- **DIMENSI PROFIL:** Untuk dimensi profil lulusan (b1_dimensiProfil), pilih beberapa yang paling relevan dari daftar berikut: ${GRADUATE_PROFILE_DIMENSIONS.join(', ')}.
`;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.9,
                topP: 0.95,
                responseMimeType: "application/json",
                responseSchema: recommendationSchema,
            }
        });
        
        // FIX: Per Gemini API guideline, it's safer to trim whitespace from the response
        // before parsing JSON, as the API can sometimes add leading/trailing newlines.
        const jsonText = response.text?.trim();
        if (!jsonText) {
            throw new Error("API mengembalikan respon kosong.");
        }
        
        const recommendationData = JSON.parse(jsonText) as CoCurricularFormData;

        // FIX: Ensure AI-recommended dates are not in the past.
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Process start date
        if (recommendationData.a6_tanggalMulai) {
            const startParts = recommendationData.a6_tanggalMulai.split('-').map(Number);
            const startDate = new Date(startParts[0], startParts[1] - 1, startParts[2]);
            if (startDate < today) {
                recommendationData.a6_tanggalMulai = today.toISOString().split('T')[0];
            }
        } else {
            recommendationData.a6_tanggalMulai = today.toISOString().split('T')[0];
        }

        // Process end date
        const finalStartParts = recommendationData.a6_tanggalMulai.split('-').map(Number);
        const finalStartDate = new Date(finalStartParts[0], finalStartParts[1] - 1, finalStartParts[2]);

        if (recommendationData.a6_tanggalSelesai) {
            const endParts = recommendationData.a6_tanggalSelesai.split('-').map(Number);
            const endDate = new Date(endParts[0], endParts[1] - 1, endParts[2]);
            if (endDate < finalStartDate) {
                const newEndDate = new Date(finalStartDate);
                newEndDate.setDate(newEndDate.getDate() + 7);
                recommendationData.a6_tanggalSelesai = newEndDate.toISOString().split('T')[0];
            }
        } else {
            const newEndDate = new Date(finalStartDate);
            newEndDate.setDate(newEndDate.getDate() + 7);
            recommendationData.a6_tanggalSelesai = newEndDate.toISOString().split('T')[0];
        }

        return recommendationData;

    } catch (error) {
        console.error("Error getting recommendation:", error);
        throw new Error("Gagal mendapatkan rekomendasi dari AI. Silakan coba lagi nanti.");
    }
};

function formatPrompt(data: CoCurricularFormData): string {
    const tujuanSpesifik = [data.b1_tujuanSpesifik1, data.b1_tujuanSpesifik2, data.b1_tujuanSpesifik3].filter(t => t).map((t, i) => `${i + 1}. ${t}`).join('\n');
    const risiko = [
        { risk: data.e1_risiko1, mitigation: data.e2_mitigasi1 },
        { risk: data.e1_risiko2, mitigation: data.e2_mitigasi2 },
    ].filter(r => r.risk).map((r, i) => `Risiko ${i + 1}: ${r.risk}\nMitigasi ${i + 1}: ${r.mitigation}`).join('\n\n');

    return `
Anda adalah seorang ahli perancang kurikulum dan kegiatan pendidikan yang sangat berpengalaman.
Tugas Anda adalah mengubah data mentah dari sebuah formulir perencanaan menjadi sebuah dokumen Rencana Pelaksanaan Kegiatan Kokurikuler yang profesional, komprehensif, dan naratif.
Dokumen yang dihasilkan harus terstruktur dengan baik, mudah dibaca, dan menggunakan bahasa yang formal dan mendidik.

**KONTEKS UTAMA:**
Dokumen ini harus dibuat berdasarkan kerangka "Dimensi Profil Lulusan" dan Standar Kompetensi Lulusan (SKL) terbaru. Berikut adalah definisinya:

**Dimensi Profil Lulusan:**
1.  **Keimanan dan Ketakwaan terhadap Tuhan YME:** Individu yang memiliki keyakinan teguh akan keberadaan Tuhan YME dan menghayati serta mengamalkan nilai-nilai spiritual dalam kehidupan sehari-hari.
2.  **Kewargaan:** Individu yang memiliki rasa cinta tanah air serta menghargai keberagaman budaya, mentaati aturan dan norma sosial dalam kehidupan bermasyarakat, memiliki kepedulian dan tanggung jawab sosial, serta berkomitmen untuk menyelesaikan masalah nyata yang berkaitan dengan keberlanjutan kehidupan, lingkungan, dan harmoni antarbangsa dalam konteks kebhinekaan global.
3.  **Penalaran Kritis:** Individu yang mampu berpikir secara logis, analitis, dan reflektif dalam memahami, mengevaluasi, serta memproses informasi untuk menyelesaikan masalah.
4.  **Kreativitas:** Individu yang mampu berpikir secara inovatif, fleksibel, dan orisinal dalam mengolah ide atau informasi untuk menciptakan solusi yang unik dan bermanfaat.
5.  **Kolaborasi:** Individu yang mampu bekerja sama secara efektif dengan orang lain secara gotong royong untuk mencapai tujuan bersama melalui pembagian peran dan tanggung jawab.
6.  **Kemandirian:** Individu yang mampu bertanggung jawab atas proses dan hasil belajarnya sendiri dengan menunjukkan kemampuan untuk mengambil inisiatif, mengatasi hambatan, dan menyelesaikan tugas secara tepat tanpa bergantung pada orang lain.
7.  **Kesehatan:** Individu yang memiliki fisik yang prima, bugar, sehat, dan mampu menjaga keseimbangan kesehatan mental dan fisik untuk mewujudkan kesejahteraan lahir dan batin (well-being).
8.  **Komunikasi:** Individu yang memiliki kemampuan komunikasi intrapribadi untuk melakukan refleksi dan antarpribadi untuk menyampaikan ide, gagasan, dan informasi baik lisan maupun tulisan serta berinteraksi secara efektif dalam berbagai situasi.

**Standar Kompetensi Lulusan (SKL):**
Rencana yang Anda buat harus disesuaikan dengan Standar Kompetensi Lulusan (SKL) untuk jenjang pendidikan yang dipilih. Gunakan pengetahuan Anda tentang perkembangan siswa pada jenjang **${data.a5_jenjangPendidikan || 'SMP (Asumsi)'}** untuk memastikan kegiatan ini sesuai, relevan, dan efektif.

---

### **DATA FORMULIR PERENCANAAN KEGIATAN KOKURIKULER**

**BAGIAN A: INFORMASI DASAR KEGIATAN**
- **Nama Kegiatan:** ${data.a1_namaKegiatan || 'Tidak diisi'}
- **Tema Kegiatan:** ${data.a2_temaKegiatan || 'Tidak diisi'}
- **Penanggung Jawab / Koordinator:** ${data.a3_penanggungJawab || 'Tidak diisi'}
- **Tim Guru yang Terlibat:** ${data.a4_timGuru || 'Tidak diisi'}
- **Target Peserta:** ${data.a5_targetPeserta || 'Tidak diisi'}
- **Jenjang Pendidikan:** ${data.a5_jenjangPendidikan || 'Tidak diisi'}
- **Alokasi Waktu:**
  - **Tanggal:** ${data.a6_tanggalMulai || 'N/A'} s.d. ${data.a6_tanggalSelesai || 'N/A'}
  - **Total Durasi:** ${data.a6_totalJP || 'Tidak diisi'}
  - **Jadwal Pelaksanaan:** ${data.a6_jadwalPelaksanaan || 'Tidak diisi'}
- **Lokasi Kegiatan:** ${data.a7_lokasiKegiatan || 'Tidak diisi'}

**BAGIAN B: PERENCANAAN STRATEGIS**
- **Latar Belakang dan Analisis Kebutuhan:** ${data.b1_analisisKebutuhan || 'Tidak diisi'}
- **Dimensi profil lulusan yang Ditargetkan:** ${data.b1_dimensiProfil.length > 0 ? data.b1_dimensiProfil.join(', ') : 'Tidak diisi'}
- **Tujuan Spesifik Kegiatan:**
${tujuanSpesifik || 'Tidak diisi'}
- **Keterkaitan Lintas Disiplin Ilmu:**
  - **Pendidikan Agama dan Budi Pekerti:** ${data.b2_keterkaitanAgama || 'Tidak diisi'}
  - **Pendidikan Pancasila:** ${data.b2_keterkaitanPancasila || 'Tidak diisi'}
  - **Bahasa Indonesia:** ${data.b2_keterkaitanBahasaIndonesia || 'Tidak diisi'}
  - **Bahasa Inggris:** ${data.b2_keterkaitanBahasaInggris || 'Tidak diisi'}
  - **Matematika:** ${data.b2_keterkaitanMatematika || 'Tidak diisi'}
  - **IPA:** ${data.b2_keterkaitanIPA || 'Tidak diisi'}
  - **IPS:** ${data.b2_keterkaitanIPS || 'Tidak diisi'}
  - **PJOK:** ${data.b2_keterkaitanPJOK || 'Tidak diisi'}
  - **Seni Budaya:** ${data.b2_keterkaitanSeniBudaya || 'Tidak diisi'}
  - **Informatika:** ${data.b2_keterkaitanInformatika || 'Tidak diisi'}
- **Alur dan Aktivitas Kegiatan:**
  - **Tahap Persiapan (Pra-Kegiatan):** ${data.b3_tahapPersiapan || 'Tidak diisi'}
  - **Tahap Pelaksanaan (Kegiatan Inti):** ${data.b3_tahapPelaksanaan || 'Tidak diisi'}
  - **Tahap Penutupan (Pasca-Kegiatan):** ${data.b3_tahapPenutupan || 'Tidak diisi'}
- **Sumber Daya yang Dibutuhkan:**
  - **Anggaran:** ${data.b4_anggaran || 'Tidak diisi'}
  - **Sarana & Prasarana:** ${data.b4_saranaPrasarana || 'Tidak diisi'}
  - **Mitra Eksternal:** ${data.b4_mitraEksternal || 'Tidak diisi'}

**BAGIAN C: ASESMEN DAN EVALUASI**
- **Asesmen Siswa:**
  - **Formatif (Selama Proses):**
    - **Teknik:** ${data.c1_asesmenFormatifTeknik || 'Tidak diisi'}
    - **Instrumen:** ${data.c1_asesmenFormatifInstrumen || 'Tidak diisi'}
  - **Sumatif (Pada Akhir Proses):**
    - **Teknik:** ${data.c1_asesmenSumatifTeknik || 'Tidak diisi'}
    - **Instrumen:** ${data.c1_asesmenSumatifInstrumen || 'Tidak diisi'}
- **Evaluasi Keberhasilan Program:** ${data.c2_evaluasiProgram || 'Tidak diisi'}

**BAGIAN D: PELAPORAN DAN TINDAK LANJUT**
- **Bentuk Pelaporan Hasil:**
  - **Kepada Orang Tua/Siswa:** ${data.d1_pelaporanOrtu || 'Tidak diisi'}
  - **Internal Sekolah:** ${data.d1_pelaporanInternal || 'Tidak diisi'}
- **Rencana Tindak Lanjut:**
  - **Untuk Siswa:** ${data.d2_tindakLanjutSiswa || 'Tidak diisi'}
  - **Untuk Program:** ${data.d2_tindakLanjutProgram || 'Tidak diisi'}

**BAGIAN E: MANAJEMEN RISIKO DAN LOGISTIK**
- **Identifikasi dan Mitigasi Risiko:**
${risiko || 'Tidak diisi'}
- **Detail Logistik Penting:**
  - **Transportasi:** ${data.e3_transportasi || 'Tidak diisi'}
  - **Konsumsi:** ${data.e3_konsumsi || 'Tidak diisi'}
  - **Perizinan:** ${data.e3_perizinan || 'Tidak diisi'}
  - **Komunikasi:** ${data.e3_komunikasi || 'Tidak diisi'}

---

**INSTRUKSI OUTPUT:**
- **PENTING: JANGAN tulis kalimat pembuka, salam, atau dialog apa pun seperti "Tentu, ini drafnya...". Langsung mulai dokumen dengan judul utama kegiatan dalam format tebal.**
- Buatlah dokumen rencana kegiatan yang mengalir dan profesional.
- Gunakan heading (judul) dan subheading (sub-judul) untuk setiap bagian utama. **TEBALKAN** judul dan sub-judul dengan mengapitnya dalam tanda bintang ganda (contoh: **Judul Bagian**).
- Untuk daftar atau rincian dalam setiap bagian (seperti tujuan, alur kegiatan, dll.), gunakan **bullet points**. Awali setiap item daftar dengan tanda bintang atau hubung (contoh: * Item pertama).
- Olah data menjadi kalimat-kalimat yang utuh dan profesional, jangan hanya menyalin.
- Pastikan semua informasi dari formulir tercakup dalam dokumen akhir.
- Akhiri dokumen dengan sebuah paragraf penutup yang memotivasi.
`;
}

export const generateCoCurricularPlan = async (formData: CoCurricularFormData): Promise<string> => {
  try {
    const prompt = formatPrompt(formData);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
        topP: 0.95,
      }
    });

    // FIX: Store response text in a variable for clarity and to avoid multiple accesses.
    const text = response.text;
    if (!text) {
      throw new Error("API mengembalikan respon kosong.");
    }

    return text;

  } catch (error) {
    console.error("Error generating plan:", error);
    throw new Error("Gagal berkomunikasi dengan layanan AI. Silakan coba lagi nanti.");
  }
};