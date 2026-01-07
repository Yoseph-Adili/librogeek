package com.librogeek.DTO;

import java.time.LocalDateTime;

public record BookCountDTO(
       String category,
         Long count
) {
}
