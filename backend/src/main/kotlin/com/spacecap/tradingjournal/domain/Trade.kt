package com.spacecap.tradingjournal.domain

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "trades")
data class Trade(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    val symbol: String,

    @Column(nullable = false)
    val entryPrice: BigDecimal,

    @Column(nullable = false)
    val quantity: Int,

    @Column(nullable = false)
    val fee: BigDecimal = BigDecimal.ZERO,

    @Column(nullable = false)
    val reason: String,

    @Column(nullable = false)
    val entryDate: LocalDateTime = LocalDateTime.now(),

    var exitPrice: BigDecimal? = null,

    var exitDate: LocalDateTime? = null
) {
    val realizedPnl: BigDecimal?
        get() {
            if (exitPrice == null) return null
            val sellAmount = exitPrice!!.multiply(BigDecimal(quantity))
            val buyAmount = entryPrice.multiply(BigDecimal(quantity))
            return sellAmount.subtract(buyAmount).subtract(fee)
        }
}
