package iewa.api.Model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public enum Role {
    BUSINESS_OWNER(Set.of(Permission.BUSINESS_OWNER_READ, Permission.BUSINESS_OWNER_WRITE, Permission.BUSINESS_OWNER_CREATE, Permission.BUSINESS_OWNER_UPDATE)),
    CUSTOMER(Set.of(Permission.CUSTOMER_READ, Permission.CUSTOMER_WRITE)),
    ADMIN(Set.of(Permission.ADMIN_READ, Permission.ADMIN_WRITE)),
    TRAINER(Set.of(Permission.TRAINER_READ, Permission.TRAINER_WRITE));


    @Getter
    private final Set<Permission> permissions;


    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.name()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }

}
