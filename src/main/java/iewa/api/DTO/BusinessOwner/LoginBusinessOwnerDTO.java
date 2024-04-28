package iewa.api.DTO.BusinessOwner;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoginBusinessOwnerDTO {




    @NotNull
    private String email;

    @NotNull

    private String password;



}
