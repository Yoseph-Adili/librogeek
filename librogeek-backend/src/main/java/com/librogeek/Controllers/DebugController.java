//package com.librogeek.Controllers;
//
//import jakarta.servlet.http.Cookie;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpSession;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.io.File;
//import java.util.Arrays;
//import java.util.Collections;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/api/debug")
//public class DebugController {
//
//
//        @GetMapping("/cover/{fileName}")
//        public String testCover(@PathVariable String fileName) {
//            File file = new File("C:/Users/yasso/Desktop/code/project/LibroGeek/librogeek-backend/books/covers/" + fileName);
//            if (file.exists()) {
//                System.out.println( "File exists: " + file.getAbsolutePath());
//                return "File exists: " + file.getAbsolutePath();
//            } else {
//                System.out.println( "File NOT found: " + file.getAbsolutePath());
//                return "File NOT found: " + file.getAbsolutePath();
//            }
//        }
//
//}
