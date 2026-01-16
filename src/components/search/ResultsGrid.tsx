import React from 'react';
import HotelCard from '../HotelCard';

interface ResultsGridProps {
    hotels: any[];
    selectedHotels: any[];
    onToggleSelection: (hotel: any) => void;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ hotels, selectedHotels, onToggleSelection }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {hotels.map(hotel => (
            <HotelCard
                key={hotel.id}
                hotel={hotel}
                isSelected={selectedHotels.some(h => h.id === hotel.id)}
                onSelect={onToggleSelection}
            />
        ))}
    </div>
);

export default ResultsGrid;
