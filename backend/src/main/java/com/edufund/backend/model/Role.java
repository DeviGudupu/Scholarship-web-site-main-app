package com.edufund.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Role {
    @JsonProperty("student")
    STUDENT,
    
    @JsonProperty("admin")
    ADMIN
}
