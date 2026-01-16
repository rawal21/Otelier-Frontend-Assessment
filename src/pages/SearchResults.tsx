import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, BarChart3, Trash2 } from 'lucide-react';
import { type RootState } from '../store';
import { useSearchHotelsQuery } from '../store/api/hotelApi';
import { toggleHotelSelection, clearSelectedHotels } from '../store/hotelSlice';
import Layout from '../components/Layout';
import HotelCard from '../components/HotelCard';
import ComparisonModal from '../components/ComparisonModal';

const SearchResults: React.FC = () => {
    const dispatch = useDispatch();
    const { searchParams, selectedHotels } = useSelector((state: RootState) => state.hotels);
    const { data: hotels, isLoading } = useSearchHotelsQuery(searchParams);

    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [priceRange, setPriceRange] = useState(500);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const filteredHotels = useMemo(() => {
        if (!hotels) return [];
        return hotels.filter(h => {
            const matchesPrice = h.price <= priceRange;
            const matchesAmenities = selectedAmenities.length === 0 ||
                selectedAmenities.every(amenity =>
                    h.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
                );
            return matchesPrice && matchesAmenities;
        });
    }, [hotels, priceRange, selectedAmenities]);

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    return (
        <Layout>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden flex gap-4">
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="flex-grow flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all"
                    >
                        <Filter className="w-5 h-5 text-blue-400" />
                        {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    {selectedHotels.length > 0 && (
                        <button
                            onClick={() => setIsCompareModalOpen(true)}
                            className="px-6 py-4 bg-blue-600 rounded-2xl font-bold flex items-center gap-2"
                        >
                            <BarChart3 className="w-5 h-5" />
                            ({selectedHotels.length})
                        </button>
                    )}
                </div>

                {/* Sidebar Filters */}
                <AnimatePresence>
                    {(showMobileFilters || window.innerWidth >= 1024) && (
                        <motion.aside
                            initial={window.innerWidth < 1024 ? { height: 0, opacity: 0 } : {}}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={window.innerWidth < 1024 ? { height: 0, opacity: 0 } : {}}
                            className="lg:w-1/4 space-y-8 overflow-hidden lg:block"
                        >
                            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl sticky top-24">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Filter className="w-5 h-5" />
                                        Filters
                                    </h2>
                                    {selectedAmenities.length > 0 && (
                                        <button
                                            onClick={() => setSelectedAmenities([])}
                                            className="text-xs text-blue-400 hover:underline"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-sm font-medium text-white/70 block">Max Price</label>
                                            <span className="text-sm font-bold text-blue-400">${priceRange}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="50"
                                            max="500"
                                            step="10"
                                            value={priceRange}
                                            onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>

                                    <div className="pt-6 border-t border-white/10">
                                        <h3 className="text-sm font-medium text-white/70 mb-4">Popular Filters</h3>
                                        <div className="space-y-3">
                                            {['Pool', 'WiFi', 'Spa', 'Gym'].map(amenity => (
                                                <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={selectedAmenities.includes(amenity)}
                                                        onChange={() => toggleAmenity(amenity)}
                                                    />
                                                    <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${selectedAmenities.includes(amenity)
                                                        ? 'bg-blue-600 border-blue-600'
                                                        : 'border-white/20 group-hover:border-blue-500'
                                                        }`}>
                                                        {selectedAmenities.includes(amenity) && (
                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <span className={`text-sm transition-colors ${selectedAmenities.includes(amenity) ? 'text-white' : 'text-white/50 group-hover:text-white'
                                                        }`}>{amenity}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Results Grid */}
                <div className="lg:w-3/4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Results in {searchParams.location || 'All Destinations'}</h1>
                            <p className="text-white/40">{filteredHotels.length} luxury stays found</p>
                        </div>

                        {selectedHotels.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="hidden sm:flex items-center gap-4"
                            >
                                <button
                                    onClick={() => setIsCompareModalOpen(true)}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all flex items-center gap-2"
                                >
                                    <BarChart3 className="w-5 h-5" />
                                    Compare ({selectedHotels.length})
                                </button>
                                <button
                                    onClick={() => dispatch(clearSelectedHotels())}
                                    className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-80 bg-white/5 animate-pulse rounded-3xl"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {filteredHotels.map(hotel => (
                                <HotelCard
                                    key={hotel.id}
                                    hotel={hotel}
                                    isSelected={selectedHotels.some(h => h.id === hotel.id)}
                                    onSelect={(h) => dispatch(toggleHotelSelection(h))}
                                />
                            ))}
                        </div>
                    )}

                    {!isLoading && filteredHotels.length === 0 && (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                            <p className="text-white/40 px-4">No hotels found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            <ComparisonModal
                isOpen={isCompareModalOpen}
                onClose={() => setIsCompareModalOpen(false)}
            />
        </Layout>
    );
};

export default SearchResults;
