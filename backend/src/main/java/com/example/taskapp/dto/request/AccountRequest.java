package com.example.taskapp.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AccountRequest {

    @Size(max = 50, message = "ユーザー名は50文字以内で入力してください")
    private String username;

    @Email(message = "メールアドレスの形式が正しくありません")
    private String email;

    @Size(min = 8, message = "パスワードは8文字以上で入力してください")
    private String password;
}
