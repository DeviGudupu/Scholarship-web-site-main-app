package com.edufund.backend.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RoleConverter implements AttributeConverter<Role, String> {

    @Override
    public String convertToDatabaseColumn(Role role) {
        if (role == null) {
            return null;
        }
        return role.name(); // Stores as uppercase: "STUDENT" or "ADMIN"
    }

    @Override
    public Role convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        // Use the robust fromString method which handles case-insensitivity
        return Role.fromString(dbData);
    }
}
