package com.librogeek.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.librogeek.Enums.Role;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
public class TokenManager {

    private final String SECRET = "mySecretKey123";
    private final TokenBlacklist tokenBlacklist = new TokenBlacklist();


    public String generateToken(Integer userId,String username, Role role) {
        return JWT.create()
                .withClaim("userId", userId)
                .withSubject(username)
                .withClaim("role", role.name())
                .withIssuer("librogeek")
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 15)) // 15 分钟
                .withJWTId(UUID.randomUUID().toString())
                .sign(Algorithm.HMAC256(SECRET));
    }


    public boolean isTokenValid(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(SECRET);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer("librogeek")
                    .build();

            DecodedJWT jwt = verifier.verify(token);


            if (tokenBlacklist.isBlacklisted(token)) return false;

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsername(String token) {
        DecodedJWT decodedJWT = JWT.decode(token);
        return decodedJWT.getSubject();
    }

    public Role getRole(String token) {
        DecodedJWT decodedJWT = JWT.decode(token);
        return Role.valueOf(decodedJWT.getClaim("role").asString());
    }
    public Integer getUserId(String token) {
        DecodedJWT decoded = JWT.require(Algorithm.HMAC256(SECRET))
                .build()
                .verify(token);

        return decoded.getClaim("userId").asInt();
    }

    public void addTokenToBlackList(String token) {
        tokenBlacklist.addTokenToBlackList(token);

    }
    public String refreshAccessToken(String refreshToken) {

        if (!isTokenValid(refreshToken)) {
            throw new RuntimeException("Refresh token invalid or blacklisted");
        }
        tokenBlacklist.addTokenToBlackList(refreshToken);

        String username = getUsername(refreshToken);
        Integer userId = getUserId(refreshToken);
        Role role = getRole(refreshToken);

        return generateToken(userId,username,role);
    }

}
