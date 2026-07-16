package com.example.taskapp.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProjectRequest {

    @NotBlank(message = "プロジェクト名は必須です")
    @Size(max = 100, message = "プロジェクト名は100文字以内で入力してください")
    private String name;

    private LocalDate deadline;

    @Size(max = 1000, message = "メモは1000文字以内で入力してください")
    private String memo;
}
