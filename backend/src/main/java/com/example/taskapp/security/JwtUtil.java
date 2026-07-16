package com.example.taskapp.security;


import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private Key getSigningKey(){
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(Long userId, String email){
        return Jwts.builder().setSubject(email).claim("userId", userId)
            .setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey()).compact();
    }

    public String getEmailFromToken(String token){
        return this.getClaims(token).getSubject();
    }

    public Long getUserIdFromToken(String token){
        return this.getClaims(token).get("userId", Long.class);
    }

    public boolean validateToken(String token){
        try{
            this.getClaims(token);
            return true;
        }catch(JwtException | IllegalArgumentException e){
            return false;
        }
    }

    
    public Claims getClaims(String token){
        return Jwts.parserBuilder().setSigningKey(getSigningKey())
            .build().parseClaimsJws(token).getBody();
    }
}
