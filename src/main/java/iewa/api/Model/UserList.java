package iewa.api.Model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Table(name = "list")
@Entity
@Data

public class UserList {

    public enum Type {
        SHORT_LIST,
        MY_LIST,
        ACCEPTED_LIST,
        REJECTED_LIST,
        IEWA_LIST
    }


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    @Column()
    private String candidateMondayId;

    @Column
    private String businessOwnerMondayId;

    @Column
    @Enumerated(EnumType.STRING)
    private Type type;


    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonBackReference
    private BusinessOwner businessOwner;
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    @Column
    private Boolean isRequestedInfo;
}
