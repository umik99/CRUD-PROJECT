package org.dw.springbootcrud.config;

import jakarta.servlet.http.HttpServletResponse;
import org.dw.springbootcrud.config.filter.JsonUsernamePasswordAuthenticationFilter;
import org.dw.springbootcrud.repository.UserRepository;
import org.dw.springbootcrud.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.servlet.config.annotation.CorsRegistration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static org.springframework.boot.devtools.restart.Restarter.disable;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authManager, UserRepository userRepository) throws Exception {
        JsonUsernamePasswordAuthenticationFilter jsonFilter = new JsonUsernamePasswordAuthenticationFilter(authManager, userRepository);
        jsonFilter.setFilterProcessesUrl("/api/security-login");

        http.securityContext(context -> context
                .securityContextRepository(new HttpSessionSecurityContextRepository())
        );

        return http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable()) // 🔥 CSRF 비활성화 (프론트엔드에서 API 요청을 받을 때 필요)
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/api/board/**", "/api/board", "/api/board/like/**").permitAll()
                        .requestMatchers("/api/signup","/api/logout", "/api/login" , "/api/user").permitAll()
                        .requestMatchers("/api/comment/**").permitAll()
                        .requestMatchers("/api/bookmark/**").permitAll()
                        .requestMatchers("/admin").hasRole("ADMIN")
                        .requestMatchers("/").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/api/mypage/**").hasAnyRole("ADMIN", "USER")
                        .anyRequest().authenticated())
                .formLogin(form ->form.disable())
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("/api/loginsuccess", true)
                )
                .logout(logout -> logout
                        .logoutUrl("/spring/logout")
                        .logoutSuccessUrl("/board") // 로그아웃 성공 시 리디렉트
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID"))
                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint((request, response, authException)->{
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                        })
                )
                .addFilterBefore(jsonFilter,UsernamePasswordAuthenticationFilter.class )
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // 🔥 비밀번호 암호화
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
    @Bean
    public WebMvcConfigurer corsConfigurer() {

    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("*")
                    .allowCredentials(true)
                    .allowedHeaders("*");

        }
    };
    }



}