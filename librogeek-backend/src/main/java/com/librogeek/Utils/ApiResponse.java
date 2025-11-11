package com.librogeek.Utils;


import org.springframework.stereotype.Component;

@Component
public class ApiResponse {
    private boolean success;
    private Object data;
    private String message;


    public ApiResponse() {
    }

    public ApiResponse(boolean success, Object data, String message) {
        this.success = success;
        this.data = data;
        this.message = message;
    }


    public static ApiResponse success(Object data, String message) {
        return new ApiResponse(true, data, message);
    }

    public static ApiResponse error(String message) {
        return new ApiResponse(false, null, message);
    }

    public boolean isSuccess() {
        return success;
    }

    public Object getData() {
        return data;
    }

    public String getMessage() {
        return message;
    }
}
