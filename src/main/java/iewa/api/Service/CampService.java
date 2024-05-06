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
import java.util.Map;

@Service
public class CampService {


    private static final Logger log = LoggerFactory.getLogger(CampService.class);
    @Autowired
    private Monday  monday;


    public ResponseEntity<?> register(Map<String, String> payload) {
        try {
            RegisterCampDTO registerCampDTO = mapPayloadToDTO(payload);

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
            log.info("Column values: {}", columnValues);
            String monday = this.monday.createItem(1394953051, registerCampDTO.getLastName() , "new_group17703", columnValues);

            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Camp registered successfully", null,201));
        }  catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    private RegisterCampDTO mapPayloadToDTO(Map<String, String> payload) {
        RegisterCampDTO registerCampDTO = new RegisterCampDTO();
        registerCampDTO.setQuestion1(payload.get("Q1"));
        registerCampDTO.setQ2(payload.get("Q2"));
        registerCampDTO.setQ3(payload.get("Q3"));
        registerCampDTO.setQ4(payload.get("Q4"));
        registerCampDTO.setQ5(payload.get("Q5"));
        registerCampDTO.setQ6(payload.get("Q6"));
        registerCampDTO.setQ7(payload.get("Q7"));
        registerCampDTO.setQ8(payload.get("Q8"));
        registerCampDTO.setQ9(payload.get("Q9"));
        registerCampDTO.setQ10(payload.get("Q10"));
        registerCampDTO.setQ11(payload.get("Q11"));
        registerCampDTO.setFirstName(payload.get("firstName"));
        registerCampDTO.setLastName(payload.get("lastName"));
        registerCampDTO.setEmail(payload.get("email"));
        registerCampDTO.setCity(payload.get("city"));
        registerCampDTO.setPhoneNumber(payload.get("phoneNumber"));
        registerCampDTO.setUniversity(payload.get("university"));
        registerCampDTO.setAge(Integer.parseInt(payload.get("age")));
        registerCampDTO.setGraduated(payload.get("graduated"));

        return registerCampDTO;
    }
}
