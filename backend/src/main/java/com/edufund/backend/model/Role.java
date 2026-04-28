package com.edufund.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {
    @JsonProperty("student")
    STUDENT,
    
    @JsonProperty("admin")
    ADMIN;

    @JsonCreator
    public static Role fromString(String value) {
        if (value == null) return null;
        try {
            return Role.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    @JsonValue
    public String toValue() {
        return name().toLowerCase();
    }
}
