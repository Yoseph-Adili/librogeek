package com.librogeek.Security;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {


    @Bean
    public WebMvcConfigurer corsConfigurer(Dotenv dotenv) {
        String frontendHost = dotenv.get("HOST") +":"+ dotenv.get("FRONTEND_PORT");
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(frontendHost)
                        .allowedMethods("*");

            }
        };
    }

}
