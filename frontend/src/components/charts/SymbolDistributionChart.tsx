import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

interface Props {
    data: Array<{ symbol: string; pnl: number }>;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

export const SymbolDistributionChart: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-bold mb-4">{t('dashboard.symbolDistribution')}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="pnl"
                        nameKey="symbol"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
