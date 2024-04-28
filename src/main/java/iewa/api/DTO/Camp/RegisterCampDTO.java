package iewa.api.DTO.Camp;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class RegisterCampDTO {
    private String Question1;

    private String Q2;

    private String Q3;

    private String Q4;

    private String Q5;

    private String Q6;

    private String Q7;

    private String Q8;

    private String Q9;

    private String Q10;

    private String Q11;
    private String firstName;

    private String lastName;

    private String email;

    private String city;

    private String phoneNumber;

    private String university;

    private int age;

    private String graduated;


}