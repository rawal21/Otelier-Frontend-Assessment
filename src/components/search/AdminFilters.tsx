import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Download, Settings } from 'lucide-react';

const AdminFilters: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-6 border-t border-purple-500/20 mt-6"
        >
            <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Admin Controls</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center gap-3 p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-2xl text-xs font-medium transition-all group">
                    <Download className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    Export All Results (CSV)
                </button>
                <button className="flex items-center gap-3 p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-2xl text-xs font-medium transition-all group">
                    <Settings className="w-4 h-4 text-purple-400 group-hover:rotate-45 transition-transform" />
                    Search Debug Mode
                </button>
            </div>

            <p className="mt-4 text-[10px] text-white/20 italic">
                * These controls are only visible to authorized administrators.
            </p>
        </motion.div>
    );
};

export default AdminFilters;
