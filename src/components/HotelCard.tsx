import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import type { Hotel } from '../store/api/hotelApi';

interface HotelCardProps {
    hotel: Hotel;
    onSelect?: (hotel: Hotel) => void;
    isSelected?: boolean;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onSelect, isSelected }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`bg-white/5 border ${isSelected ? 'border-blue-500' : 'border-white/10'} rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300`}
            onClick={() => onSelect?.(hotel)}
        >
            <div className="aspect-[4/3] overflow-hidden relative">
                <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-medium">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {hotel.rating}
                </div>
            </div>

            <div className="p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                    <h3 className="font-bold text-lg group-hover:text-blue-400 transition-colors leading-tight line-clamp-2">{hotel.name}</h3>
                    <p className="text-xl font-bold whitespace-nowrap">${hotel.price}<span className="text-xs text-white/50 font-normal">/night</span></p>
                </div>

                <div className="flex items-center gap-1 text-white/50 text-sm mb-4">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{hotel.location}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map(amenity => (
                        <span key={amenity} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-white/10 rounded-md">
                            {amenity}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default HotelCard;
