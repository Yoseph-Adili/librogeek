package com.librogeek.DTO;

import com.librogeek.Enums.BookType;
import java.math.BigDecimal;
import java.time.LocalDateTime;


public record earningDTO(
        Integer bookId,
        BigDecimal price,
        BookType bookType,
        LocalDateTime purchasedAt
) {
}
