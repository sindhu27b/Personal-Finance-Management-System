package org.project.fintrack.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import org.project.fintrack.constants.AssetType;


import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "investments")
public class Investment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Enumerated(EnumType.STRING)
    private AssetType assetType;

    // Ticker/symbol or name
    private String symbol;

    @NotNull
    @DecimalMin("0.0")
    @Column(precision = 20, scale = 8)
    private BigDecimal quantity;

    @NotNull @DecimalMin("0.0")
    @Column(precision = 15, scale = 2)
    private BigDecimal avgBuyPrice;

    @NotNull @DecimalMin("0.0")
    @Column(precision = 15, scale = 2)
    private BigDecimal currentPrice;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() {
        {
            return id;
        }
    }

    public void setId(Long id) {
        {
            this.id = id;
        }
    }

    public User getUser() {
        {
            return user;
        }
    }

    public void setUser(User user) {
        {
            this.user = user;
        }
    }

    public AssetType getAssetType() {
        {
            return assetType;
        }
    }

    public void setAssetType(AssetType assetType) {
        {
            this.assetType = assetType;
        }
    }

    public String getSymbol() {
        {
            return symbol;
        }
    }

    public void setSymbol(String symbol) {
        {
            this.symbol = symbol;
        }
    }

    public BigDecimal getQuantity() {
        {
            return quantity;
        }
    }

    public void setQuantity(BigDecimal quantity) {
        {
            this.quantity = quantity;
        }
    }

    public BigDecimal getAvgBuyPrice() {
        {
            return avgBuyPrice;
        }
    }

    public void setAvgBuyPrice(BigDecimal avgBuyPrice) {
        {
            this.avgBuyPrice = avgBuyPrice;
        }
    }

    public BigDecimal getCurrentPrice() {
        {
            return currentPrice;
        }
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        {
            this.currentPrice = currentPrice;
        }
    }

    public Instant getCreatedAt() {
        {
            return createdAt;
        }
    }

    public void setCreatedAt(Instant createdAt) {
        {
            this.createdAt = createdAt;
        }
    }
}