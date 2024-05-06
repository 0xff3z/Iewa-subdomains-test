package iewa.api.DTO.BusinessOwner;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RequestCandidateDTO {
    private String additionalNotes;
    private String englishLevel;
    private String experienceLevel;
    private String jobRequirementsExperiences;
    private String jobResponsibilities;
    private String jobTitle;
    private String jobType;
    private String maxSalary;
    private String requiredSkills;
    private String requiredSkillsDetails;
    private String whenToStart;
    private String workHours;
    private String currency;


}