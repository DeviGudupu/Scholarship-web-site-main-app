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
        if (value == null || value.trim().isEmpty()) return null;
        try {
            return Role.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            // Handle common variations
            if (value.trim().equalsIgnoreCase("student")) return STUDENT;
            if (value.trim().equalsIgnoreCase("admin")) return ADMIN;
            return null;
        }
    }

    @JsonValue
    public String toValue() {
        return name().toLowerCase();
    }
}
