import React from 'react';
import { BookOpen, Database, Calculator, BarChart, Server, Layers, ArrowRight, CheckCircle2, Cpu, HardDrive, DollarSign, MemoryStick } from 'lucide-react';

const DocumentationView: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex p-4 bg-indigo-500/20 text-indigo-400 rounded-2xl mb-4">
                    <BookOpen size={32} />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Dokumentasi Sistem</h1>
                <p className="text-slate-400">Sistem Pendukung Keputusan Pemilihan Cloud VPS menggunakan Metode TOPSIS</p>
            </div>

            {/* Overview */}
            <section className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Layers size={20} className="text-blue-400" />
                    1. Gambaran Umum Sistem
                </h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Sistem ini membantu pengambil keputusan dalam memilih layanan Cloud VPS terbaik berdasarkan
                    kriteria yang dapat disesuaikan. Menggunakan metode <strong className="text-blue-400">TOPSIS
                        (Technique for Order of Preference by Similarity to Ideal Solution)</strong> untuk memberikan
                    ranking objektif berdasarkan preferensi pengguna.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-dark-900 p-4 rounded-xl text-center">
                        <Cpu className="mx-auto text-blue-400 mb-2" size={24} />
                        <div className="text-white font-bold">CPU</div>
                        <div className="text-xs text-slate-400">Benefit</div>
                    </div>
                    <div className="bg-dark-900 p-4 rounded-xl text-center">
                        <MemoryStick className="mx-auto text-green-400 mb-2" size={24} />
                        <div className="text-white font-bold">RAM</div>
                        <div className="text-xs text-slate-400">Benefit</div>
                    </div>
                    <div className="bg-dark-900 p-4 rounded-xl text-center">
                        <HardDrive className="mx-auto text-purple-400 mb-2" size={24} />
                        <div className="text-white font-bold">Disk I/O</div>
                        <div className="text-xs text-slate-400">Benefit</div>
                    </div>
                    <div className="bg-dark-900 p-4 rounded-xl text-center">
                        <DollarSign className="mx-auto text-orange-400 mb-2" size={24} />
                        <div className="text-white font-bold">Harga</div>
                        <div className="text-xs text-slate-400">Cost</div>
                    </div>
                </div>
            </section>

            {/* Architecture */}
            <section className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Server size={20} className="text-green-400" />
                    2. Arsitektur Sistem
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 my-6">
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center">
                        <div className="text-blue-400 font-bold">Frontend</div>
                        <div className="text-sm text-slate-400">React + Vite + TypeScript</div>
                    </div>
                    <ArrowRight className="text-slate-600 hidden md:block" />
                    <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
                        <div className="text-green-400 font-bold">Backend API</div>
                        <div className="text-sm text-slate-400">FastAPI + Python</div>
                    </div>
                    <ArrowRight className="text-slate-600 hidden md:block" />
                    <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
                        <div className="text-purple-400 font-bold">Data Source</div>
                        <div className="text-sm text-slate-400">Excel (TOPSIS_Input_Level.xlsx)</div>
                    </div>
                </div>
            </section>

            {/* TOPSIS Steps */}
            <section className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Calculator size={20} className="text-yellow-400" />
                    3. Langkah-Langkah Metode TOPSIS
                </h2>
                <div className="space-y-4">
                    {[
                        { step: 1, title: 'Matriks Keputusan (X)', desc: 'Mengumpulkan data kriteria untuk setiap alternatif vendor' },
                        { step: 2, title: 'Normalisasi Matriks (R)', desc: 'rij = xij / √(Σxij²) - Menormalisasi nilai agar berada dalam skala yang sama' },
                        { step: 3, title: 'Matriks Terbobot (Y)', desc: 'yij = wj × rij - Mengalikan nilai ternormalisasi dengan bobot kriteria' },
                        { step: 4, title: 'Solusi Ideal', desc: 'A+ (maksimum untuk benefit, minimum untuk cost) dan A- (sebaliknya)' },
                        { step: 5, title: 'Jarak Euclidean', desc: 'D+ = √(Σ(yij - A+)²) dan D- = √(Σ(yij - A-)²)' },
                        { step: 6, title: 'Skor TOPSIS', desc: 'Score = D- / (D+ + D-) - Semakin tinggi semakin baik' },
                    ].map((item) => (
                        <div key={item.step} className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold shrink-0">
                                {item.step}
                            </div>
                            <div>
                                <h4 className="font-bold text-white">{item.title}</h4>
                                <p className="text-sm text-slate-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Data Flow */}
            <section className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Database size={20} className="text-cyan-400" />
                    4. Alur Data Sistem
                </h2>
                <div className="space-y-3">
                    {[
                        { icon: '📥', title: 'Input Data', desc: 'Data vendor diinput melalui menu "Data Vendor" atau langsung dari Excel' },
                        { icon: '⚖️', title: 'Tentukan Bobot', desc: 'Pengguna mengatur bobot kriteria sesuai prioritas (total = 100%)' },
                        { icon: '⚙️', title: 'Proses TOPSIS', desc: 'Backend menghitung normalisasi, pembobotan, solusi ideal, dan jarak' },
                        { icon: '📊', title: 'Hasil Ranking', desc: 'Sistem menampilkan ranking vendor beserta visualisasi dan analisis' },
                        { icon: '💾', title: 'Simpan Riwayat', desc: 'Hasil dapat disimpan ke riwayat untuk referensi di masa depan' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center p-3 bg-dark-900 rounded-xl">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                                <h4 className="font-bold text-white">{item.title}</h4>
                                <p className="text-sm text-slate-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <BarChart size={20} className="text-pink-400" />
                    5. Fitur Sistem
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { title: 'Dashboard', desc: 'Ringkasan data dan statistik vendor' },
                        { title: 'Analisa & Ranking', desc: 'Perhitungan TOPSIS dengan visualisasi lengkap' },
                        { title: 'Perhitungan Detail', desc: 'Lihat setiap langkah perhitungan TOPSIS' },
                        { title: 'Data Vendor', desc: 'Kelola data alternatif (CRUD)' },
                        { title: 'Riwayat', desc: 'Simpan dan lihat perhitungan sebelumnya' },
                        { title: 'Radar Chart', desc: 'Perbandingan visual antar vendor' },
                        { title: 'Sensitivity Analysis', desc: 'Analisis pengaruh perubahan bobot' },
                        { title: 'Dark/Light Mode', desc: 'Toggle tema sesuai preferensi' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                            <CheckCircle2 className="text-green-400 shrink-0 mt-1" size={18} />
                            <div>
                                <h4 className="font-medium text-white">{item.title}</h4>
                                <p className="text-sm text-slate-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Level Mapping */}
            <section className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4">6. Pemetaan Level Kriteria</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-dark-700">
                                <th className="p-3 text-left text-slate-400">Level</th>
                                <th className="p-3 text-center text-blue-400">CPU (Core)</th>
                                <th className="p-3 text-center text-green-400">RAM (GB)</th>
                                <th className="p-3 text-center text-purple-400">Disk I/O (MB/s)</th>
                                <th className="p-3 text-center text-orange-400">Harga (USD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                [1, 2, 2, 150, 15],
                                [2, 4, 4, 300, 35],
                                [3, 6, 8, 500, 75],
                                [4, 8, 16, 700, 150],
                                [5, 10, 32, 1000, 250],
                            ].map((row) => (
                                <tr key={row[0]} className="border-b border-dark-700/50">
                                    <td className="p-3 font-bold text-white">L{row[0]}</td>
                                    <td className="p-3 text-center text-slate-300">{row[1]}</td>
                                    <td className="p-3 text-center text-slate-300">{row[2]}</td>
                                    <td className="p-3 text-center text-slate-300">{row[3]}</td>
                                    <td className="p-3 text-center text-slate-300">${row[4]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Footer */}
            <div className="text-center text-slate-500 text-sm pb-8">
                © 2025 SPK Kajek - Sistem Pendukung Keputusan Pemilihan Cloud VPS
            </div>
        </div>
    );
};

export default DocumentationView;
