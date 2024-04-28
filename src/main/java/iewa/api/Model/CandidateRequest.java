package iewa.api.Model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;


@Table(name = "candidate_request")
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CandidateRequest {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(unique = true)
    private String MondayId;
    @Column(nullable = false)
    private String jobTitle;

    @Column
    private String skills;

    @Column(nullable = false)
    private String experienceLevel;

    @Column(nullable = false)
    private Integer numberOfEmployees;

    @Column(nullable = false)
    private String jobResponsibilities;

    @Column(nullable = false)
    private String employmentType;

    @Column(nullable = false)
    private String englishLevel;

    @Column(nullable = false)
    private String workingDays;

    @Column(nullable = false)
    private String whenToStart;

    @Column(nullable = false)
    private String salaryCap;

    @Column
    private String additionalNotes;

    @Column(nullable = false)
    private String technicalSkills;

    @Column
    private String jobRequirementsExperiences;

    @Column
    private String contractType;

    @Column
    private String status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonBackReference
    private BusinessOwner businessOwner;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    @UpdateTimestamp
    private Date updatedAt;
}
