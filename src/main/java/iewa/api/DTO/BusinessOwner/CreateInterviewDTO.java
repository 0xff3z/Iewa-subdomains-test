package iewa.api.DTO.BusinessOwner;


import lombok.Data;

@Data
public class CreateInterviewDTO {

    public String date;

    public String time;

    private String listId;

    public String candidateMondayId;
}
