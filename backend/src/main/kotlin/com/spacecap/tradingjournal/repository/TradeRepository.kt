package com.spacecap.tradingjournal.repository

import com.spacecap.tradingjournal.domain.Trade
import org.springframework.data.jpa.repository.JpaRepository

interface TradeRepository : JpaRepository<Trade, Long> {
    fun findByDeletedAtIsNull(): List<Trade>
}
