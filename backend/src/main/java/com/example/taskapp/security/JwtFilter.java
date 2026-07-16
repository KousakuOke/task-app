package com.example.taskapp.security;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    protected void doFilterInternal(HttpServletRequest request, 
        HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException{
            String authHeader = request.getHeader("Authorization");
            if(authHeader != null && authHeader.startsWith("Bearer ")){
                String token = authHeader.substring(7);

                if(jwtUtil.validateToken(token)){
                    Long userId = jwtUtil.getUserIdFromToken(token);
                    String email = jwtUtil.getEmailFromToken(token);

                    UserDetails userDetails = new User(email, "", new ArrayList<>());
                    
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails, userId, new ArrayList<>());
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
            filterChain.doFilter(request, response);
        }
}
