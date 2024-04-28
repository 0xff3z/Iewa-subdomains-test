package iewa.api.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "Trainee")
@Data
public class Trainee {

    @Id
    @Column(name = "mondayId", nullable = false)
    private String mondayId;

    @Column(name = "aboutMe")
    private String aboutMe;

    @Column(name = "areYouPassedIewaCamp")
    private String areYouPassedIewaCamp;

    @Column(name = "careerPath")
    private String careerPath;

    @Column(name = "college")
    private String college;

    @Column(name = "email")
    private String email;

    @Column(name = "englishLevel")
    private String englishLevel;

    @Column(name = "favoriteOfWorkplace")
    private String favoriteOfWorkplace;

    @Column(name = "howToWork")
    private String howToWork;

    @Column(name = "name")
    private String name;

    @Column(name = "major")
    private String major;

    @Column(name = "phoneNumber")
    private String phoneNumber;

    @Column(name = "PlaceOfResidence")
    private String placeOfResidence;

    @Column(name = "salary")
    private String salary;

    @Column(name = "searchingFor")
    private String searchingFor;

    @Column(name = "cv")
    private String cv;

    @Column()
    private String gender;

    @Column(name = "createdAt")
    private Date createdAt;

    @Column(name = "updatedAt")
    private Date updatedAt;



    // Getters and setters
    // Constructors
}
