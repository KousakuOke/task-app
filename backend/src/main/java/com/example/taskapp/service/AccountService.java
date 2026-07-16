package com.example.taskapp.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.taskapp.dto.request.AccountRequest;
import com.example.taskapp.exception.ResourceNotFoundException;
import com.example.taskapp.model.User;
import com.example.taskapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void updateAccount(Long userId, AccountRequest req){
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません"));
        
        if (req.getEmail() != null && !req.getEmail().isEmpty()) {
            userRepository.findByEmail(req.getEmail()).ifPresent(existingUser -> {
                if (!existingUser.getId().equals(userId)) {
                    throw new RuntimeException("このメールアドレスはすでに使われています");
                }
            });
            user.setEmail(req.getEmail());
        }

        if (req.getPassword() != null && !req.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        userRepository.save(user);
    }

}
