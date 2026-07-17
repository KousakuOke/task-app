package com.example.taskapp.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.taskapp.dto.request.LoginRequest;
import com.example.taskapp.dto.request.RegisterRequest;
import com.example.taskapp.dto.response.AuthResponse;
import com.example.taskapp.exception.ResourceNotFoundException;
import com.example.taskapp.model.Tag;
import com.example.taskapp.model.User;
import com.example.taskapp.repository.TagRepository;
import com.example.taskapp.repository.UserRepository;
import com.example.taskapp.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req){
        if(userRepository.findByEmail(req.getEmail()).isPresent()){
            throw new RuntimeException("このメールアドレスはすでに使われています");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));

        User saved = userRepository.save(user);

        Map<String, String> defaultTags = new HashMap<>();
        defaultTags.put("未着手", "#9ca3af");
        defaultTags.put("作業中", "#3b82f6");
        defaultTags.put("完了", "#22c55e");

        defaultTags.forEach((tagName, color) -> {
            Tag tag = new Tag();
            tag.setName(tagName);
            tag.setColor(color);
            tag.setUser(saved);
            tagRepository.save(tag);
        });

        String token = jwtUtil.generateToken(saved.getId(), saved.getEmail());
        return new AuthResponse(token, saved.getId(), saved.getUsername());
    }

    public AuthResponse login(LoginRequest req){
        User user = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません"));

            if(!passwordEncoder.matches(req.getPassword(), user.getPassword())){
                throw new RuntimeException("パスワードが間違っています");
            }

            String token = jwtUtil.generateToken(user.getId(), user.getEmail());
            return new AuthResponse(token, user.getId(), user.getUsername());
    }

}
