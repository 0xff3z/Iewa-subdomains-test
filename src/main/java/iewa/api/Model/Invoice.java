package iewa.api.Model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "invoice")
@Data
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String invoiceId;

    @Column
    private String invoiceType;

    @Column
    private String invoiceDate;

    @Column
    private String invoiceMondayId;

    @Column
    private String invoiceStatus;

    @Column
    private String invoiceAssetUrl;

    @Column
    private String invoiceAmount;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonBackReference
    private BusinessOwner businessOwner;


}
