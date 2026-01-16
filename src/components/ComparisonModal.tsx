import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Star } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose }) => {
    const { selectedHotels } = useSelector((state: RootState) => state.hotels);

    if (!isOpen) return null;

    const chartData = selectedHotels.map(h => ({
        name: h.name,
        price: h.price,
        rating: h.rating,
        fullName: h.name
    }));

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-5xl bg-[#1a1a1a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Compare Selected Stays</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 max-h-[80vh] overflow-y-auto">
                        {/* Price Comparison Chart */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-blue-400">
                                <TrendingUp className="w-5 h-5" />
                                <h3 className="font-bold uppercase tracking-wider text-sm">Price Comparison (USD)</h3>
                            </div>
                            <div className="h-64 w-full bg-white/5 p-4 rounded-2xl">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#ffffff40"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                                        />
                                        <YAxis
                                            stroke="#ffffff40"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#121212', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Bar dataKey="price" radius={[8, 8, 0, 0]}>
                                            {chartData.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Rating Comparison Chart */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-purple-400">
                                <Star className="w-5 h-5" />
                                <h3 className="font-bold uppercase tracking-wider text-sm">Guest Rating Comparison</h3>
                            </div>
                            <div className="h-64 w-full bg-white/5 p-4 rounded-2xl">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                        <XAxis
                                            type="number"
                                            domain={[0, 5]}
                                            stroke="#ffffff40"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            stroke="#ffffff40"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => value.length > 8 ? `${value.substring(0, 8)}...` : value}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#121212', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                        />
                                        <Bar dataKey="rating" radius={[0, 8, 8, 0]}>
                                            {chartData.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} fillOpacity={0.8} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Comparative Table */}
                        <div className="lg:col-span-2 overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="py-4 font-medium text-white/40">Feature</th>
                                        {selectedHotels.map(h => (
                                            <th key={h.id} className="py-4 font-bold px-4">
                                                <div className="max-w-[150px] truncate" title={h.name}>
                                                    {h.name}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr>
                                        <td className="py-4 text-white/40">Price / Night</td>
                                        {selectedHotels.map(h => (
                                            <td key={h.id} className="py-4 font-mono px-4 text-blue-400 font-bold">${h.price}</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="py-4 text-white/40">Rating</td>
                                        {selectedHotels.map(h => (
                                            <td key={h.id} className="py-4 px-4">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    <span className="font-bold">{h.rating}</span>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="py-4 text-white/40">Amenities</td>
                                        {selectedHotels.map(h => (
                                            <td key={h.id} className="py-4 px-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {h.amenities.map(a => (
                                                        <span key={a} className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full uppercase font-medium tracking-wide">{a}</span>
                                                    ))}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ComparisonModal;
