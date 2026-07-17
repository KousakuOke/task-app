package com.example.taskapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TagRequest {

    @NotBlank(message = "タグ名は必須です")
    @Size(max = 50, message = "タグ名は50文字以内で入力してください")
    private String name;

    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "カラーコードの形式が正しくありません")
    private String color;
}
