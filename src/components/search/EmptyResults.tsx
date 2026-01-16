import React from 'react';

const EmptyResults: React.FC = () => (
    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
        <p className="text-white/40 px-4">No hotels found matching your criteria.</p>
    </div>
);

export default EmptyResults;
