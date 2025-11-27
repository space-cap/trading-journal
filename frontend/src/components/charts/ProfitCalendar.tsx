import React, { useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useTranslation } from 'react-i18next';
import type { Trade } from '../../types/Trade';
import { aggregateByDate } from '../../utils/chartUtils';

interface Props {
    trades: Trade[];
}

export const ProfitCalendar: React.FC<Props> = ({ trades }) => {
    const { t } = useTranslation();

    // 날짜별 손익 집계
    const dailyPnl = useMemo(() => aggregateByDate(trades), [trades]);

    // 타일 내용 렌더링 (날짜별 손익 표시)
    const tileContent = ({ date }: { date: Date }) => {
        const dateStr = date.toISOString().split('T')[0];
        const pnl = dailyPnl.get(dateStr);

        if (pnl === undefined) return null;

        return (
            <div className={`text-xs font-semibold mt-1 ${pnl > 0 ? 'text-green-700' : pnl < 0 ? 'text-red-700' : 'text-gray-700'
                }`}>
                {pnl > 0 ? '+' : ''}{pnl.toFixed(0)}
            </div>
        );
    };

    // 타일 클래스명 (배경색)
    const tileClassName = ({ date }: { date: Date }) => {
        const dateStr = date.toISOString().split('T')[0];
        const pnl = dailyPnl.get(dateStr);

        if (pnl === undefined) return '';

        if (pnl > 0) {
            return 'bg-green-50 hover:bg-green-100';
        } else if (pnl < 0) {
            return 'bg-red-50 hover:bg-red-100';
        }
        return '';
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">{t('calendar.title', 'Profit Calendar')}</h3>
            <div className="profit-calendar">
                <Calendar
                    locale="ko-KR"
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                    className="w-full border-none"
                />
            </div>
            <style>{`
                .profit-calendar .react-calendar {
                    border: none;
                    font-family: inherit;
                }
                .profit-calendar .react-calendar__tile {
                    padding: 0.75rem 0.5rem;
                    height: auto;
                    min-height: 60px;
                }
                .profit-calendar .react-calendar__tile--now {
                    background: #e0f2fe;
                }
                .profit-calendar .react-calendar__tile--now:hover {
                    background: #bae6fd;
                }
                .profit-calendar .react-calendar__navigation button {
                    font-size: 1rem;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};
