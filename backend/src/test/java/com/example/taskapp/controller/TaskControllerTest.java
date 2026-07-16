package com.example.taskapp.controller;

import java.time.LocalDate;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import com.example.taskapp.dto.request.TaskRequest;
import com.example.taskapp.model.User;
import com.example.taskapp.repository.TaskRepository;
import com.example.taskapp.repository.UserRepository;
import com.example.taskapp.security.JwtUtil;

import tools.jackson.databind.json.JsonMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JsonMapper jsonMapper;

    private String token;
    private Long userId;

    @BeforeEach
    void setUp(){
        User user = new User();
        user.setUsername("テストユーザー");
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("1234"));
        User saved = userRepository.save(user);

        userId = saved.getId();
        token = jwtUtil.generateToken(userId, saved.getEmail());
    }

    @AfterEach
    void tearDown(){
        taskRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void タスク作成_成功() throws Exception{
        TaskRequest req = new TaskRequest();
        req.setName("結合テストタスク");
        req.setDeadline(LocalDate.of(2026, 6, 1));
        req.setMemo("テストメモ");

        mockMvc.perform(post("/api/tasks").header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonMapper.writeValueAsString(req)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("結合テストタスク"))
            .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void タスク作成_バリデーションエラー() throws Exception{
        TaskRequest req = new TaskRequest();
        req.setName("");

        mockMvc.perform(post("/api/tasks").header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.name").value("タスク名は必須です"));
    }

    @Test
    void タスク一覧取得_認証なしは失敗() throws Exception{
        mockMvc.perform(get("/api/tasks")).andExpect(status().isForbidden());
    }

    @Test
    void タスク一覧取得_認証ありは成功() throws Exception {
        mockMvc.perform(get("/api/tasks").header("Authorization", "Bearer " + token))
            .andExpect(status().isOk());
    }

}
