package org.dw.springbootcrud.config.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.Setter;
import org.dw.springbootcrud.domain.User;
import org.dw.springbootcrud.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;

import java.io.IOException;
import java.io.PrintWriter;


@Setter
public class JsonUsernamePasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final UserRepository userRepository;

    public JsonUsernamePasswordAuthenticationFilter(AuthenticationManager authenticationManager, UserRepository userRepository) {

        super.setAuthenticationManager(authenticationManager);
        this.userRepository = userRepository;
    }
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response){
        try{

            LoginRequest loginRequest = objectMapper.readValue( request.getInputStream(), LoginRequest.class);

            UsernamePasswordAuthenticationToken authRequest =
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),loginRequest.getPassword());

            setDetails(request, authRequest);
            return this.getAuthenticationManager().authenticate(authRequest);
        }catch(IOException e){
            throw new RuntimeException("Failed to parse login JSON",e);
        }
    }

    static class LoginRequest {
        public String username;
        public String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {

        SecurityContextHolder.getContext().setAuthentication(authResult);


        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authResult);
        SecurityContextHolder.setContext(context);

        // 🔥 2. 세션에 SecurityContext 저장
        HttpSession session = request.getSession(true); // 세션 없으면 생성
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

        // 🔥 3. 유저 객체 저장 (이건 너가 쓰는 부분)
        String username = authResult.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        session.setAttribute("user", user);

        // 여기에서 필요한 정보를 응답으로 보낼 수 있음
        response.setContentType("application/json");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"username\": \"" + user.getUsername() + "\"}");
    }
}
