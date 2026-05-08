package com.damla.wick_n_vale.common.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class ApiError {

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private final LocalDateTime timestamp;
    private final String message;
    private final int status;
    private List<String> errors;

    public ApiError(int status, String message) {
        this.timestamp = LocalDateTime.now();
        this.message = message;
        this.status = status;
    }

    public ApiError(int status, String message, List<String> errors) {
        this(status, message);
        this.errors = errors;
    }
}
