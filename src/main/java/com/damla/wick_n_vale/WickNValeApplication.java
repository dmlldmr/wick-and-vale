package com.damla.wick_n_vale;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = {UserDetailsServiceAutoConfiguration.class})
public class WickNValeApplication {

	public static void main(String[] args) {
		SpringApplication.run(WickNValeApplication.class, args);
	}

}
