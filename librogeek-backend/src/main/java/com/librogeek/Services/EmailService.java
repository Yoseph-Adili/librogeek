package com.librogeek.Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;


    public void sendHtmlEmail(String to, String subject, String name, String code) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");


        Context context = new Context();
        context.setVariable("code", code);


        String htmlContent = templateEngine.process("verify_email", context);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);


        mailSender.send(message);
    }
}
