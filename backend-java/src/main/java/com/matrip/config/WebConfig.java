package com.matrip.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
                .allowedHeaders("*");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String baseDir = Paths.get("..").toAbsolutePath().normalize().toString().replace("\\", "/");
        String uploadsDir = "file:" + baseDir + "/backend-java/uploads/";

        // Apenas mapeia a rota de uploads do disco local
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadsDir)
                .setCachePeriod(0);

        // Mapeia os recursos estáticos sob static/ no classpath
        registry.addResourceHandler("/css/**").addResourceLocations("classpath:/static/css/");
        registry.addResourceHandler("/img/**").addResourceLocations("classpath:/static/img/");
    }
}
