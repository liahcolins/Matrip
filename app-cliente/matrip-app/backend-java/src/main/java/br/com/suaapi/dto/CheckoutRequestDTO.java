package br.com.suaapi.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CheckoutRequestDTO {
    private List<CartItemDTO> items;
    private BigDecimal total;
    private BigDecimal serviceFee;
    private BigDecimal grandTotal;
    private String paymentMethod; // pix, credit, paypal
    private CreditCardDTO creditCard;
}
