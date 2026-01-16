import React from 'react';

const ResultsSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-80 bg-white/5 animate-pulse rounded-3xl"></div>
        ))}
    </div>
);

export default ResultsSkeleton;
