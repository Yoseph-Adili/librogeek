package com.librogeek;


import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class LibrogeekApplication {

    private static final Logger log = LoggerFactory.getLogger(LibrogeekApplication.class);

    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.configure().directory("./").load();
        System.out.println(System.getProperty("user.dir"));



        System.setProperty("server.port", dotenv.get("BACKEND_PORT", "8080"));
        SpringApplication.run(LibrogeekApplication.class, args);
    }


}
