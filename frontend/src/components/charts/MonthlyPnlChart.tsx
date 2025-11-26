import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

interface Props {
    data: Array<{ month: string; profit: number; loss: number; net: number; count: number }>;
}

export const MonthlyPnlChart: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-bold mb-4">{t('dashboard.monthlyPnl')}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="profit" fill="#10b981" name={t('dashboard.profit')} />
                    <Bar dataKey="loss" fill="#ef4444" name={t('dashboard.loss')} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
