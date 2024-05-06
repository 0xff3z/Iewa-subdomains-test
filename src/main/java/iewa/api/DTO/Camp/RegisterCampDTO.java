package iewa.api.DTO.Camp;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class RegisterCampDTO {
    private String question1;
    private String q2;
    private String q3;
    private String q4;
    private String q5;
    private String q6;
    private String q7;
    private String q8;
    private String q9;
    private String q10;
    private String q11;
    private String firstName;
    private String lastName;
    private String email;
    private String city;
    private String phoneNumber;
    private String university;
    private int age;
    private String graduated;
}