package iewa.api.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "candidates")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Candidate {

    public enum CandidateType {
        marketPlace,
        iewa
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String mondayId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private String firstName;

    @Column(nullable = true)
    private String job;

    @Lob
    @Column(nullable = true)
    private String bio;

    @Lob
    @Column(nullable = true)
    private String yearsOfExperience;

    @Lob
    @Column(nullable = true)
    private String yearsOfExperienceTwo;

    @Lob
    @Column(nullable = true)
    private String yearsOfExperienceThree;

    @Lob
    @Column(nullable = true)
    private String yearsOfExperienceFour;

    @Lob
    @Column(nullable = true)
    private String currency;

    @Lob
    @Column(nullable = true)
    private String education;

    @Column(nullable = true)
    private String expectedSalary;

    @Column(nullable = true)
    private String nationality;

    @Lob
    @Column(nullable = true)
    private String courses;

    @Column(nullable = true)
    private String np;

    @Lob
    @Column(nullable = true)
    private String skills;

    @Lob
    @Column(nullable = true)
    private String project;

    @Lob
    @Column(nullable = true)
    private String projectTwo;

    @Lob
    @Column(nullable = true)
    private String projectThree;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_owner_id")
    private BusinessOwner businessOwner;





}
