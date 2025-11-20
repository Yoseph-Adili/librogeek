package com.librogeek.Security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Value("${file.pdfs.path}")
    private String progilePath;

    @Value("${file.covers.path}")
    private String coversPath;

    @Value("${file.pdfs.path}")
    private String pdfsPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/profile/**")
                .addResourceLocations("file:" + progilePath);

        registry.addResourceHandler("/covers/**")
                .addResourceLocations("file:" + coversPath);

        registry.addResourceHandler("/pdf/**")
                .addResourceLocations("file:" + pdfsPath);
    }
}
