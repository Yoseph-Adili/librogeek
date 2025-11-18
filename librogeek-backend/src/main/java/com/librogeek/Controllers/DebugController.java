package com.librogeek.Controllers;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @GetMapping("/session")
    public ResponseEntity<?> debugSession(HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        // 获取 cookies
        Cookie[] cookies = request.getCookies();
        String cookieString = (cookies == null)
                ? "no cookies"
                : Arrays.stream(cookies)
                .map(c -> c.getName() + "=" + c.getValue())
                .collect(Collectors.joining("; "));

        Map<String, Object> response = new HashMap<>();
        response.put("cookies", cookieString);
        response.put("sessionExists", session != null);

        if (session != null) {
            response.put("sessionId", session.getId());
            response.put("sessionAttributes",
                    Collections.list(session.getAttributeNames())
                            .stream()
                            .collect(Collectors.toMap(n -> n, session::getAttribute))
            );
        } else {
            response.put("sessionId", "no session");
        }

        return ResponseEntity.ok(response);
    }
}
