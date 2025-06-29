package com.example.meetingroombookingsystem.entity.vo.request.auth;

import jakarta.validation.constraints.Email;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

/**
 * 密码重置表单实体
 */
@Data
public class EmailResetVO {
    @Email
    String email;
    @Length(max = 6, min = 6)
    String code;
    @Length(min = 6, max = 20)
    String password;
}
