package com.librogeek.Component;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Component
public class VerificationCodeManager {


    private final Map<Long, Map<String, String>> codeMap = new HashMap<>();



    public String generateCode(Long userId, String email) {
        String code = randomLetters(6);
        Map<String, String> emailCodeMap = new HashMap<>();
        emailCodeMap.put(email, code);
        codeMap.put(userId, emailCodeMap);
        return code;
    }


    public String verifyCode(Long userId, String code) {
        Map<String, String> emailCodeMap = codeMap.get(userId);
        if (emailCodeMap != null) {
            for (Map.Entry<String, String> entry : emailCodeMap.entrySet()) {
                String email = entry.getKey();
                String correctCode = entry.getValue();
                if (correctCode.equals(code)) {
                    codeMap.remove(userId);
                    return email;
                }
            }
        }
        return null;
    }



    private String randomLetters(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * chars.length());
            sb.append(chars.charAt(index));
        }
        return sb.toString();
    }
}


