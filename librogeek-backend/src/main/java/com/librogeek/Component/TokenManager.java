package com.librogeek.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import org.springframework.stereotype.Component;

@Component
public class TokenManager {
    private final String SECRET = "mySecretKey123";

    public String generateToken(String username) {
        return JWT.create()
                .withSubject(username)
                .withIssuer("librogeek")
                .sign(Algorithm.HMAC256(SECRET));
    }

    public boolean isTokenValid(String token) {
        try {
            JWT.require(Algorithm.HMAC256(SECRET))
                    .withIssuer("librogeek")
                    .build()
                    .verify(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsername(String token) {
        DecodedJWT decodedJWT = JWT.decode(token);
        return decodedJWT.getSubject();
    }
}
