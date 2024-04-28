package iewa.api.Model;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity()
@Table(name = "business_owner")
public class BusinessOwner extends User {


    @Column()
    private String companyName;
    @Column
    private String mondayId;

    @OneToMany(mappedBy = "businessOwner", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<UserList> lists = new ArrayList<>();

    @OneToMany(mappedBy = "businessOwner", orphanRemoval = true, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Interview> interviews = new ArrayList<>();

    @OneToMany(mappedBy = "businessOwner", orphanRemoval = true, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<CandidateRequest> candidateRequests = new ArrayList<>();

    @OneToMany(mappedBy = "businessOwner", orphanRemoval = true, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Invoice> invoices = new ArrayList<>();



    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }


    public List<Interview> getNotAcceptedInterview() {
        List<Interview> notAcceptedInterviews = new ArrayList<>();
        for (Interview interview : interviews) {
            if (interview.getAcceptionStatus() != Interview.AcceptionStatus.مقبول) {
                notAcceptedInterviews.add(interview);
            }
        }
        return notAcceptedInterviews;
    }





    public List<UserList> getUserList(UserList.Type type) {
        List<UserList> shortList = new ArrayList<>();
        for (UserList list : lists) {
            if (list.getType() == type) {
                shortList.add(list);
            }
        }
        return shortList;
    }









    public ArrayList<Integer> getShortListIds() {
        ArrayList<Integer> shortListIds = new ArrayList<>();
        for (UserList list : lists) {
            if (list.getType() == UserList.Type.SHORT_LIST) {
                shortListIds.add(Integer.parseInt(list.getCandidateMondayId()));
            }
        }
        return shortListIds;
    }

    public ArrayList<Integer> getMyListIds() {
        ArrayList<Integer> myListIds = new ArrayList<>();
        for (UserList list : lists) {
            if (list.getType() == UserList.Type.MY_LIST) {
                myListIds.add(Integer.parseInt(list.getCandidateMondayId()));
            }
        }
        return myListIds;
    }

    public ArrayList<Integer> getAcceptedListIds() {
        ArrayList<Integer> acceptedListIds = new ArrayList<>();
        for (UserList list : lists) {
            if (list.getType() == UserList.Type.ACCEPTED_LIST) {
                acceptedListIds.add(Integer.parseInt(list.getCandidateMondayId()));
            }
        }
        return acceptedListIds;
    }


    public ArrayList<Integer> getRejectedListIds() {
        ArrayList<Integer> rejectedListIds = new ArrayList<>();
        for (UserList list : lists) {
            if (list.getType() == UserList.Type.REJECTED_LIST) {
                rejectedListIds.add(Integer.parseInt(list.getCandidateMondayId()));
            }
        }
        return rejectedListIds;
    }

    public ArrayList<Integer> getIewaListIds() {
        ArrayList<Integer> iewaListIds = new ArrayList<>();
        for (UserList list : lists) {
            if (list.getType() == UserList.Type.IEWA_LIST) {
                iewaListIds.add(Integer.parseInt(list.getCandidateMondayId()));
            }
        }
        return iewaListIds;
    }

    public ArrayList<Integer> getAllListIds() {
        ArrayList<Integer> allListIds = new ArrayList<>();
        for (UserList list : lists) {
            allListIds.add(Integer.parseInt(list.getCandidateMondayId()));
        }
        return allListIds;
    }

    public ArrayList<CandidateRequest> getCandidateRequests() {
        ArrayList<CandidateRequest> candidateRequests = new ArrayList<>();
        for (CandidateRequest candidateRequest : this.candidateRequests) {
            candidateRequests.add(candidateRequest);
        }
        return candidateRequests;
    }


    public ArrayList<Invoice> getInvoices() {
        ArrayList<Invoice> invoices = new ArrayList<>();
        for (Invoice invoice : this.invoices) {
            invoices.add(invoice);
        }
        return invoices;
    }











    public void setMondayId(String mondayId) {
        this.mondayId = mondayId;
    }

    public BusinessOwner() {
        this.lists = new ArrayList<>();
    }


    public String getMondayId() {
        return mondayId;
    }


}
