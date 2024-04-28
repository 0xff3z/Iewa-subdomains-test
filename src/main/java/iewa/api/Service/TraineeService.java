package iewa.api.Service;

import iewa.api.Config.ApiResponseDTO;
import iewa.api.DTO.Trainee.RegisterTraineeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
@Service
public class TraineeService {



    @Autowired
    private Monday monday;

    public ResponseEntity<?> register(RegisterTraineeDTO registerTraineeDTO){
        try {
            Map<String, String> columnValues = new HashMap<>();
            columnValues.put("status6", registerTraineeDTO.getSex());
            columnValues.put("phone", registerTraineeDTO.getPhoneNumber());
            columnValues.put("email", registerTraineeDTO.getEmail());
            columnValues.put("long_text", registerTraineeDTO.getAboutMe());
            columnValues.put("status5", registerTraineeDTO.getSearchingFor());
            columnValues.put("numbers", String.valueOf(registerTraineeDTO.getSalary()));
            columnValues.put("status", String.valueOf(registerTraineeDTO.getAreYouPassedIewaCamp()));
            columnValues.put("color", registerTraineeDTO.getPlaceOfResidence());
            columnValues.put("status8", registerTraineeDTO.getMajor());
            columnValues.put("status35", registerTraineeDTO.getFavoriteOfWorkplace());
            columnValues.put("status4", registerTraineeDTO.getCareerPath());
            columnValues.put("status98", registerTraineeDTO.getEnglishLevel());
            columnValues.put("status9", registerTraineeDTO.getHowToWork());
            columnValues.put("status3", registerTraineeDTO.getCollege());
            this.monday.createItem(1392728485, registerTraineeDTO.getFirstName() + " " + registerTraineeDTO.getLastName(), "topics", columnValues);
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Success", null,200));
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body("Error");
        }
    }
}
