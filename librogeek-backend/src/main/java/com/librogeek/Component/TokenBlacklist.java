package com.librogeek.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class TokenBlacklist {
    private final Map<String, Long> tokenBlacklist = new ConcurrentHashMap<>();

    public void addTokenToBlackList(String token) {
        DecodedJWT decodedJWT = JWT.decode(token);
        String jti = decodedJWT.getId();
        long expirationTime = decodedJWT.getExpiresAt().getTime();
        tokenBlacklist.put(jti, expirationTime);
        System.out.println("Token added to blacklist: " + tokenBlacklist);
    }

    public boolean isBlacklisted(String jti) {
        if (tokenBlacklist.containsKey(jti)) {
            Long expirationTime = tokenBlacklist.get(jti);
            if (expirationTime > System.currentTimeMillis()) {
                return true;
            } else {
                tokenBlacklist.remove(jti);
                return false;
            }
        } else {
            return false;
        }
    }

}
