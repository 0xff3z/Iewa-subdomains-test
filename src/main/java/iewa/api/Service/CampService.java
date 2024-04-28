package iewa.api.Service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import iewa.api.Config.ApiResponseDTO;
import iewa.api.DTO.Camp.RegisterCampDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class CampService {


    private static final Logger log = LoggerFactory.getLogger(CampService.class);
    @Autowired
    private Monday  monday;


    public ResponseEntity<?> register(RegisterCampDTO registerCampDTO) {
        try {
            log.info("Registering camp: {}", registerCampDTO);
            HashMap<String, String> columnValues = new HashMap<>();
            columnValues.put("email", registerCampDTO.getEmail() + " " + registerCampDTO.getEmail());


            columnValues.put("single_select3", String.valueOf(registerCampDTO.getGraduated()));
            columnValues.put("short_text7", registerCampDTO.getCity());
            columnValues.put("phone", "+966" + registerCampDTO.getPhoneNumber());
            columnValues.put("short_text", registerCampDTO.getFirstName());
            columnValues.put("short_text77", registerCampDTO.getUniversity());
            columnValues.put("number", String.valueOf(registerCampDTO.getAge()));
            columnValues.put("single_select4", registerCampDTO.getQuestion1());
            columnValues.put("single_select0", registerCampDTO.getQ2());
            columnValues.put("single_select1", registerCampDTO.getQ3());
            columnValues.put("single_select7", registerCampDTO.getQ4());
            columnValues.put("single_select8", registerCampDTO.getQ5());
            columnValues.put("single_select00", registerCampDTO.getQ6());
            columnValues.put("single_select9", registerCampDTO.getQ7());
            columnValues.put("single_select5", registerCampDTO.getQ8());
            columnValues.put("single_select72", registerCampDTO.getQ9());
            columnValues.put("single_select80", registerCampDTO.getQ10());
            columnValues.put("single_select44", registerCampDTO.getQ11());

            String monday = this.monday.createItem(1394953051, registerCampDTO.getLastName() , "new_group17703", columnValues);

            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Camp registered successfully", null,201));
        }  catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
