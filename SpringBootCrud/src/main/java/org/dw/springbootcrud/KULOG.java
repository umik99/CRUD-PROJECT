package org.dw.springbootcrud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class KULOG {

    public static void main(String[] args) {
        SpringApplication.run(KULOG.class, args);
    }

}
