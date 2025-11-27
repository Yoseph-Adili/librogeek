package com.librogeek.DTO;

import java.time.LocalDateTime;

public record CommendDTO(
        Integer user_id,
        String profile_photo,
        String username,
        String name,
        String comment,
        LocalDateTime createdAt
) {
}
