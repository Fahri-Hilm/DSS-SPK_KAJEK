import React, { useState } from 'react';
import { Calculator, Play, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { clsx } from 'clsx';
import axios from 'axios';
import { Skeleton } from './ui/Skeleton';
import { toast } from 'sonner';

interface CalculationResult {
    weights: { cpu: number; ram: number; disk: number; price: number };
    criteria: { names: string[]; types: string[] };
    formulas: { [key: string]: string };
    step1_input: { title: string; description: string; vendors: string[]; data: number[][]; col_names: string[] };
    step2_normalized: { title: string; description: string; vendors: string[]; data: number[][]; divisors: number[] };
    step3_weighted: { title: string; description: string; vendors: string[]; data: number[][] };
    step4_ideal: { title: string; description: string; ideal_pos: number[]; ideal_neg: number[] };
    step5_distance: { title: string; description: string; vendors: string[]; d_pos: number[]; d_neg: number[] };
    step6_score: { title: string; description: string; vendors: string[]; scores: number[]; ranks: number[] };
}

const CalculationView: React.FC = () => {
    const [weights, setWeights] = useState({ cpu: 0.25, ram: 0.25, disk: 0.25, price: 0.25 });
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [expandedSteps, setExpandedSteps] = useState<{ [key: string]: boolean }>({
        step1: true, step2: true, step3: true, step4: true, step5: true, step6: true
    });

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    const isValid = Math.abs(totalWeight - 1.0) < 0.01;

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/calculate-detail', weights);
            setResult(response.data);
            toast.success("Perhitungan selesai!");
        } catch (error) {
            console.error(error);
            toast.error('Gagal menghitung. Periksa koneksi ke backend.');
        } finally {
            setLoading(false);
        }
    };

    const toggleStep = (step: string) => {
        setExpandedSteps(prev => ({ ...prev, [step]: !prev[step] }));
    };

    const renderMatrix = (data: number[][], vendors: string[], colNames: string[]) => (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-dark-900/50">
                        <th className="p-3 text-left text-slate-400">Alternatif</th>
                        {colNames.map((col, i) => (
                            <th key={i} className="p-3 text-center text-slate-400">{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                    {data.map((row, i) => (
                        <tr key={i} className="hover:bg-dark-700/30">
                            <td className="p-3 font-medium text-white">{vendors[i]}</td>
                            {row.map((val, j) => (
                                <td key={j} className="p-3 text-center text-slate-300 font-mono">
                                    {typeof val === 'number' ? val.toFixed(4) : val}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const StepCard = ({ stepKey, step, children }: { stepKey: string; step: { title: string; description: string }; children: React.ReactNode }) => (
        <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
            <button
                onClick={() => toggleStep(stepKey)}
                className="w-full p-4 flex items-center justify-between hover:bg-dark-700/30 transition-all"
            >
                <div className="text-left">
                    <h4 className="text-lg font-bold text-white">{step.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{step.description}</p>
                </div>
                {expandedSteps[stepKey] ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
            </button>
            {expandedSteps[stepKey] && (
                <div className="p-4 pt-0 border-t border-dark-700">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg">
                            <Calculator size={24} />
                        </span>
                        Perhitungan TOPSIS
                    </h2>
                    <p className="text-slate-400 mt-1">Lihat langkah-langkah perhitungan dan rumus TOPSIS secara detail</p>
                </div>
            </div>

            {/* Weight Input */}
            <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Bobot Kriteria</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(weights).map(([key, val]) => (
                        <div key={key}>
                            <label className="block text-sm text-slate-400 mb-2 capitalize">{key}</label>
                            <input
                                type="number"
                                min="0" max="1" step="0.05"
                                value={val}
                                onChange={(e) => setWeights({ ...weights, [key]: parseFloat(e.target.value) || 0 })}
                                className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white text-center focus:border-cyan-500 focus:outline-none"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-700">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400">Total:</span>
                        <span className={clsx("font-bold", isValid ? "text-green-400" : "text-red-400")}>
                            {totalWeight.toFixed(2)}
                        </span>
                        {!isValid && <span className="text-red-400 text-sm">(harus = 1.0)</span>}
                    </div>
                    <button
                        onClick={handleCalculate}
                        disabled={!isValid || loading}
                        className={clsx(
                            "px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all",
                            isValid ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-dark-700 text-slate-500 cursor-not-allowed"
                        )}
                    >
                        {loading ? "Menghitung..." : <><Play size={18} /> Hitung</>}
                    </button>
                </div>
            </div>

            {/* Formula Reference */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20 p-6">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Info size={20} className="text-cyan-400" /> Rumus TOPSIS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="bg-dark-900/50 p-3 rounded-xl">
                        <div className="text-cyan-400 font-medium">Normalisasi</div>
                        <div className="text-white font-mono mt-1">rij = xij / √(Σxij²)</div>
                    </div>
                    <div className="bg-dark-900/50 p-3 rounded-xl">
                        <div className="text-cyan-400 font-medium">Pembobotan</div>
                        <div className="text-white font-mono mt-1">yij = wj × rij</div>
                    </div>
                    <div className="bg-dark-900/50 p-3 rounded-xl">
                        <div className="text-cyan-400 font-medium">Jarak Euclidean</div>
                        <div className="text-white font-mono mt-1">D± = √(Σ(yij - A±)²)</div>
                    </div>
                    <div className="bg-dark-900/50 p-3 rounded-xl">
                        <div className="text-cyan-400 font-medium">Score TOPSIS</div>
                        <div className="text-white font-mono mt-1">Score = D- / (D+ + D-)</div>
                    </div>
                    <div className="bg-dark-900/50 p-3 rounded-xl">
                        <div className="text-cyan-400 font-medium">Ideal Positif (A+)</div>
                        <div className="text-white font-mono mt-1">Max(BENEFIT), Min(COST)</div>
                    </div>
                    <div className="bg-dark-900/50 p-3 rounded-xl">
                        <div className="text-cyan-400 font-medium">Ideal Negatif (A-)</div>
                        <div className="text-white font-mono mt-1">Min(BENEFIT), Max(COST)</div>
                    </div>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-dark-800 rounded-2xl border border-dark-700 p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-4 w-96" />
                                </div>
                                <Skeleton className="h-6 w-6 rounded-full" />
                            </div>
                            <Skeleton className="h-32 w-full rounded-xl" />
                        </div>
                    ))}
                </div>
            ) : result ? (
                <div className="space-y-4">
                    {/* Step 1 */}
                    <StepCard stepKey="step1" step={result.step1_input}>
                        {renderMatrix(result.step1_input.data, result.step1_input.vendors, result.step1_input.col_names)}
                    </StepCard>

                    {/* Step 2 */}
                    <StepCard stepKey="step2" step={result.step2_normalized}>
                        <div className="mb-3 p-3 bg-dark-900/50 rounded-xl text-sm">
                            <span className="text-slate-400">Pembagi (√Σxij²): </span>
                            {result.step2_normalized.divisors.map((d, i) => (
                                <span key={i} className="text-cyan-400 font-mono mx-2">{result.step1_input.col_names[i]}={d}</span>
                            ))}
                        </div>
                        {renderMatrix(result.step2_normalized.data, result.step2_normalized.vendors, result.step1_input.col_names)}
                    </StepCard>

                    {/* Step 3 */}
                    <StepCard stepKey="step3" step={result.step3_weighted}>
                        <div className="mb-3 p-3 bg-dark-900/50 rounded-xl text-sm">
                            <span className="text-slate-400">Bobot (W): </span>
                            <span className="text-cyan-400 font-mono mx-2">CPU={result.weights.cpu}</span>
                            <span className="text-cyan-400 font-mono mx-2">RAM={result.weights.ram}</span>
                            <span className="text-cyan-400 font-mono mx-2">Disk={result.weights.disk}</span>
                            <span className="text-cyan-400 font-mono mx-2">Harga={result.weights.price}</span>
                        </div>
                        {renderMatrix(result.step3_weighted.data, result.step3_weighted.vendors, result.step1_input.col_names)}
                    </StepCard>

                    {/* Step 4 */}
                    <StepCard stepKey="step4" step={result.step4_ideal}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-dark-900/50">
                                        <th className="p-3 text-left text-slate-400">Solusi</th>
                                        {result.step1_input.col_names.map((col, i) => (
                                            <th key={i} className="p-3 text-center text-slate-400">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-700">
                                    <tr className="bg-green-500/10">
                                        <td className="p-3 font-medium text-green-400">A+ (Ideal Positif)</td>
                                        {result.step4_ideal.ideal_pos.map((val, i) => (
                                            <td key={i} className="p-3 text-center text-green-300 font-mono">{val.toFixed(6)}</td>
                                        ))}
                                    </tr>
                                    <tr className="bg-red-500/10">
                                        <td className="p-3 font-medium text-red-400">A- (Ideal Negatif)</td>
                                        {result.step4_ideal.ideal_neg.map((val, i) => (
                                            <td key={i} className="p-3 text-center text-red-300 font-mono">{val.toFixed(6)}</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </StepCard>

                    {/* Step 5 */}
                    <StepCard stepKey="step5" step={result.step5_distance}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-dark-900/50">
                                        <th className="p-3 text-left text-slate-400">Alternatif</th>
                                        <th className="p-3 text-center text-green-400">D+ (Jarak ke A+)</th>
                                        <th className="p-3 text-center text-red-400">D- (Jarak ke A-)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-700">
                                    {result.step5_distance.vendors.map((vendor, i) => (
                                        <tr key={i} className="hover:bg-dark-700/30">
                                            <td className="p-3 font-medium text-white">{vendor}</td>
                                            <td className="p-3 text-center text-green-300 font-mono">{result.step5_distance.d_pos[i].toFixed(6)}</td>
                                            <td className="p-3 text-center text-red-300 font-mono">{result.step5_distance.d_neg[i].toFixed(6)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </StepCard>

                    {/* Step 6 - Final */}
                    <StepCard stepKey="step6" step={result.step6_score}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-dark-900/50">
                                        <th className="p-3 text-center text-slate-400">Rank</th>
                                        <th className="p-3 text-left text-slate-400">Alternatif</th>
                                        <th className="p-3 text-center text-slate-400">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-700">
                                    {result.step6_score.vendors
                                        .map((vendor, i) => ({ vendor, score: result.step6_score.scores[i], rank: result.step6_score.ranks[i] }))
                                        .sort((a, b) => a.rank - b.rank)
                                        .map((item, i) => (
                                            <tr key={i} className={clsx("hover:bg-dark-700/30", item.rank === 1 && "bg-yellow-500/10")}>
                                                <td className="p-3 text-center">
                                                    <span className={clsx(
                                                        "px-3 py-1 rounded-full font-bold text-sm",
                                                        item.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                                                            item.rank === 2 ? "bg-slate-500/20 text-slate-400" :
                                                                item.rank === 3 ? "bg-orange-500/20 text-orange-500" :
                                                                    "text-slate-500"
                                                    )}>#{item.rank}</span>
                                                </td>
                                                <td className="p-3 font-medium text-white">{item.vendor}</td>
                                                <td className="p-3 text-center text-cyan-400 font-mono font-bold">{item.score.toFixed(6)}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </StepCard>
                </div>
            ) : (
                <div className="bg-dark-800 rounded-2xl border border-dark-700 border-dashed p-12 text-center">
                    <Calculator className="mx-auto text-slate-600 mb-4" size={48} />
                    <h4 className="text-xl font-bold text-slate-300">Belum ada perhitungan</h4>
                    <p className="text-slate-500 mt-2">Atur bobot kriteria dan klik "Hitung" untuk melihat langkah-langkah perhitungan TOPSIS</p>
                </div>
            )}
        </div>
    );
};

export default CalculationView;
