import React from 'react';

const SkeletonRow: React.FC = () => (
    <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-9 bg-slate-200 rounded"></div>
    </div>
);

const SkeletonTextArea: React.FC = () => (
    <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-24 bg-slate-200 rounded"></div>
    </div>
);

export const SkeletonLoader: React.FC = () => {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-slate-200">
            <div className="h-8 bg-slate-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-6 animate-pulse">
                <SkeletonRow />
                <SkeletonTextArea />
                <div className="grid grid-cols-2 gap-6">
                    <SkeletonRow />
                    <SkeletonRow />
                </div>
                <SkeletonRow />
            </div>
        </div>
    );
};
