import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hotel, User, LogIn, Search, LogOut, Menu, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import type { RootState } from '../store';
import { supabase } from '../utils/supabase';
import { logout } from '../store/authSlice';

const Navbar: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        dispatch(logout());
        navigate('/login');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="border-b border-white/10 bg-[#1a1a1a]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight" onClick={() => setIsMenuOpen(false)}>
                    <Hotel className="text-blue-500 w-6 h-6" />
                    <span>LuxStay</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/search" className="text-sm font-medium hover:text-blue-400 transition-colors flex items-center gap-1">
                        <Search className="w-4 h-4" />
                        Search
                    </Link>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                                <User className="w-4 h-4 text-blue-400" />
                                <span>{user.email?.split('@')[0]}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium hover:text-red-400 transition-colors flex items-center gap-1"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
                            <LogIn className="w-4 h-4" />
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
                    aria-label="Toggle Menu"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/10 bg-[#1a1a1a] overflow-hidden"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            <Link
                                to="/search"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                            >
                                <Search className="w-5 h-5 text-blue-400" />
                                <span className="font-medium">Browse Hotels</span>
                            </Link>

                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 p-3 border-t border-white/5">
                                        <User className="w-5 h-5 text-blue-400" />
                                        <span className="font-medium text-white/70">{user.email}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors text-left"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">Sign Out</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 p-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition-all"
                                >
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
