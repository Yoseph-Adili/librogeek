package com.librogeek.Security;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired
    private JwtAuthFilter jwtAuthFilter;


    private static final String[] WHITELIST = {
            "/api/users/register",
            "/api/users/login",
            "/api/users/status",
            "/api/users/refresh",
            "/api/users/logout",
            "/api/users/loginUserByEmail",
            "/api/users/loginUserByEmailVerify",
            "/api/users/uploadPhoto/{user_id}",

            "/api/books/mostRead",
            "/api/books/all/**",
            "/api/books/{category}",
            "/api/books/getMostReadCategory",
            "/api/books/getMostDownloaded",
            "/api/books/book/{bookId}",
            "/api/books/book/bookshelf/{bookId}",
            "/api/books/book/tag/add/{tagId}",
            "/api/books/book/tag/subtract/{tagId}",
            "/api/books/book/tag/{tagId}",
            "/api/books/tags/getAllTags",
            "/api/books/book/comment/{book_id}",
            "/api/books/book/pdf/{bookId}",
            "/api/books/book/bookPage/{book_id}",
//            "/api/debug/cover/{fileName}"
//            "/api/users/changeUserNames/{user_id}",


            "/api/shipping/addShippingRequest",
            "/api/shipping/addPayment",

            "/covers/**",
            "/pdf/**",
            "/profile/**"

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
                    config.setAllowedOrigins(List.of(this.frontendUrl));
                    config.setAllowedMethods(List.of("GET", "POST", "DELETE", "PATCH", "OPTIONS"));
                    config.setAllowCredentials(true);





                    config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
                    config.addExposedHeader("Authorization");
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
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .httpBasic(AbstractHttpConfigurer::disable);
        http.addFilterBefore(jwtAuthFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
