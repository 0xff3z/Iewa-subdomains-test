package iewa.api.DTO.BusinessOwner;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterBusinessOwnerDTO {


    @NotNull
    private String fullName;

    @NotNull
    private String email;

    @NotNull
    @Size(min = 8, max = 32)
    private String password;

    @NotNull
    private String company;


    @NotNull
    private String phoneNumber;


}
