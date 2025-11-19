package com.librogeek.Security;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final String frontendUrl;

    private static final String[] WHITELIST = {
            "/api/users/register",
            "/api/users/login",
            "/api/users/status",
            "/api/users/logout",



            "/api/books/mostRead",
            "/api/books/all",
            "/api/books/{category}",
            "/api/books/getMostReadCategory",
//            "/api/debug/cover/{fileName}"





            "/covers/**",
            "/pdf/**"

    };
    public SecurityConfig() {
        Dotenv dotenv = Dotenv.load();
        String host = dotenv.get("HOST", "http://localhost");
        String port = dotenv.get("FRONTEND_PORT", "5173");
        this.frontendUrl = host + ":" + port;
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of(frontendUrl));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowCredentials(true);

                    config.setAllowedHeaders(List.of("*"));
                    config.addExposedHeader("Set-Cookie");
                    return config;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                WHITELIST
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .logout(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )

                .httpBasic(AbstractHttpConfigurer::disable);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
