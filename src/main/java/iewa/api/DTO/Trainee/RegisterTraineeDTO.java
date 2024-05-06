package iewa.api.DTO.Trainee;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RegisterTraineeDTO {
    @JsonProperty("sex")
    private String sex;

    @JsonProperty("phoneNumber")
    private String phoneNumber;

    @JsonProperty("email")
    private String email;

    @JsonProperty("aboutMe")
    private String aboutMe;

    @JsonProperty("searchingFor")
    private String searchingFor;

    @JsonProperty("salary")
    private String salary;

    @JsonProperty("areYouPassedIewaCamp")
    private String areYouPassedIewaCamp;

    @JsonProperty("placeOfResidence")
    private String placeOfResidence;

    @JsonProperty("major")
    private String major;

    @JsonProperty("favoriteOfWorkplace")
    private String favoriteOfWorkplace;

    @JsonProperty("careerPath")
    private String careerPath;

    @JsonProperty("englishLevel")
    private String englishLevel;

    @JsonProperty("howToWork")
    private String howToWork;

    @JsonProperty("college")
    private String college;

    @JsonProperty("firstName")
    private String firstName;

    @JsonProperty("lastName")
    private String lastName;
}
