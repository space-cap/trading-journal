import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

interface Props {
    data: Array<{ date: string; cumulative: number; symbol: string }>;
}

export const CumulativePnlChart: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-bold mb-4">{t('dashboard.cumulativePnl')}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="cumulative"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981' }}
                        name={t('dashboard.cumulative')}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
