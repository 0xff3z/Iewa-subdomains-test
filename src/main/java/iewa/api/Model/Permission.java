package iewa.api.Model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {
    BUSINESS_OWNER_READ("business_owner:read"),
    BUSINESS_OWNER_CREATE("business_owner:create"),
    BUSINESS_OWNER_UPDATE("business_owner:update"),
    BUSINESS_OWNER_WRITE("business_owner:write"),
    BUSINESS_OWNER_DELETE("business_owner:delete"),
    CUSTOMER_READ("customer:read"),
    CUSTOMER_WRITE("customer:write"),
    ADMIN_READ("admin:read"),
    ADMIN_WRITE("admin:write"),
    TRAINER_READ("trainer:read"),
    TRAINER_WRITE("trainer:write");
    @Getter
    private final String permission;



}
