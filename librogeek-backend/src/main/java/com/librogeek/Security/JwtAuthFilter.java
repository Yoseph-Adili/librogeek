package com.librogeek.Security;

import com.librogeek.Component.TokenManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {


    public static final List<String> WHITELIST_PATHS = List.of(
            "/api/users/register",
            "/api/users/login",
            "/api/users/status",
            "/api/users/refresh",
            "/api/users/logout",
            "/api/books/mostRead",
            "/api/books/",
            "/api/books/getCategories",
            "/api/books/getMostReadCategory",
            "/api/books/getMostDownloaded",
            "/api/users/uploadPhoto/",
            "/covers/",
            "/pdf/",
            "/profile/"
    );



    @Autowired
    private TokenManager tokenManager;



    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        System.out.println("this is the filter");
        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();
        boolean isWhitelist = WHITELIST_PATHS.stream().anyMatch(path::startsWith);
        if (isWhitelist) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String token = header.substring(7);
        if (!tokenManager.isTokenValid(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }


        String username = tokenManager.getUsername(token);


        var authorities = java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER"));

        var auth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                username, null, authorities
        );

        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(auth);

        filterChain.doFilter(request, response);
    }
}

