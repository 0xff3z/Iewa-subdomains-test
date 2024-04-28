package iewa.api.Model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "interview")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Interview {
    public enum Status {
        بانتظار_تاكيد_المرشح("بانتظار تاكيد المرشح"),
        مقابلة_مؤكدة("مقابلة مؤكدة"),
        لم_تتم_المقابلة("لم تتم المقابلة"),
        تمت_المقابلة("تمت المقابلة");

        private final String description;
        public static Status fromString(String text) {
            for (Status b : Status.values()) {
                if (b.description.equalsIgnoreCase(text)) {
                    return b;
                }
            }
            throw new IllegalArgumentException("No constant with text " + text + " found");
        }
        Status(String description) {
            this.description = description.replaceAll("_", " ");
        }

        public String getDescription() {
            return description;
        }
    }


    public enum AcceptionStatus {
        مقبول("مقبول"),
        مرفوض("مرفوض"),
        قيد_المراجعة("قيد المراجعة");

        private final String description;

        AcceptionStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }

        public static AcceptionStatus fromString(String text) {
            for (AcceptionStatus status : AcceptionStatus.values()) {
                if (status.description.equals(text)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("No constant with text " + text + " found");
        }
    }

    @Id
    @GeneratedValue
    private long id;


    @Column
    private String candidateMondayId;

    @Column
    private String businessOwnerMondayId;

    @Column
    private String interviewDate;

    @Column
    private String interviewTime;

    @Column
    private String interviewLink;

    @Column
    private String interviewMondayId;

    @Column
    private String listId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonBackReference
    private BusinessOwner businessOwner;

    @ManyToOne(fetch = FetchType.EAGER)

    private Candidate candidate;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Enumerated(EnumType.STRING)
    private AcceptionStatus acceptionStatus;


}
