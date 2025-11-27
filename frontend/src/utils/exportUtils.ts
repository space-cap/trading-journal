import * as XLSX from 'xlsx';
import type { Trade } from '../types/Trade';

/**
 * 매매 목록을 엑셀 파일로 내보내기
 * @param trades 매매 목록
 * @param t 번역 함수
 */
export const exportToExcel = (trades: Trade[], t: (key: string) => string) => {
    // 1. 데이터 변환
    const data = trades.map(trade => ({
        [t('tradeList.columns.symbol')]: trade.symbol,
        [t('tradeList.columns.entryDate')]: trade.entryDate ? new Date(trade.entryDate).toLocaleString() : '',
        [t('tradeList.columns.entryPrice')]: trade.entryPrice,
        [t('tradeList.columns.quantity')]: trade.quantity,
        [t('tradeList.columns.exitDate')]: trade.exitDate ? new Date(trade.exitDate).toLocaleString() : '',
        [t('tradeList.columns.exitPrice')]: trade.exitPrice || '',
        [t('tradeList.columns.pnl')]: trade.realizedPnl || 0,
        [t('tradeList.columns.fee')]: trade.fee,
        [t('tradeList.columns.reason')]: trade.reason,
        'Notes': trade.notes || '',
        'Tags': trade.tags ? trade.tags.join(', ') : ''
    }));

    // 2. 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 3. 컬럼 너비 자동 조절 (간단한 버전)
    const wscols = [
        { wch: 10 }, // Symbol
        { wch: 20 }, // Entry Date
        { wch: 10 }, // Entry Price
        { wch: 8 },  // Qty
        { wch: 20 }, // Exit Date
        { wch: 10 }, // Exit Price
        { wch: 10 }, // PnL
        { wch: 8 },  // Fee
        { wch: 30 }, // Reason
        { wch: 40 }, // Notes
        { wch: 20 }, // Tags
    ];
    worksheet['!cols'] = wscols;

    // 4. 워크북 생성
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trades');

    // 5. 파일명 생성 (trading_journal_YYYY-MM-DD.xlsx)
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `trading_journal_${dateStr}.xlsx`;

    // 6. 파일 다운로드
    XLSX.writeFile(workbook, fileName);
};
