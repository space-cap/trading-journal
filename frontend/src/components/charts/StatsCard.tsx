import React from 'react';

interface Props {
    title: string;
    value: string | number;
    color: 'green' | 'red' | 'blue' | 'purple' | 'gray';
    icon?: string;
}

const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
};

export const StatsCard: React.FC<Props> = ({ title, value, color, icon }) => {
    return (
        <div className={`p-4 rounded-lg border-2 ${colorClasses[color]}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium opacity-75">{title}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                {icon && <span className="text-3xl opacity-50">{icon}</span>}
            </div>
        </div>
    );
};
