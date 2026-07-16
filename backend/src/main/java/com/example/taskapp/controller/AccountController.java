package com.example.taskapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.taskapp.dto.request.AccountRequest;
import com.example.taskapp.service.AccountService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PutMapping
    public ResponseEntity<Void> updateAccount(@Valid @RequestBody AccountRequest req){
        accountService.updateAccount(this.getCurrentUserId(), req);
        return ResponseEntity.noContent().build();
    }

    public Long getCurrentUserId(){
        UsernamePasswordAuthenticationToken auth = 
            (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        return (Long)auth.getCredentials();
    }
}
