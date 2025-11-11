package com.librogeek.Utils;

public class ServiceResult<T> {
    private boolean success;
    private String message;
    private T data;

    public ServiceResult(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public T getData() { return data; }

    public static <T> ServiceResult<T> success(T data, String message) {
        return new ServiceResult<>(true, message, data);
    }

    public static <T> ServiceResult<T> failure(String message) {
        return new ServiceResult<>(false, message, null);
    }
}
