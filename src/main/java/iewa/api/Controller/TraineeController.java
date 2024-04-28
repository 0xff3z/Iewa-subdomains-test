package iewa.api.Controller;


import iewa.api.DTO.Trainee.RegisterTraineeDTO;
import iewa.api.Service.TraineeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/trainee")
public class TraineeController {
    @Autowired
    private TraineeService traineeService;

    @PostMapping(name = "/register", consumes = {"multipart/form-data"},path = "/register")
    public ResponseEntity<?> register(
            @RequestPart RegisterTraineeDTO registerTraineeDTO,
            @RequestPart MultipartFile file
    ) {
        try {
            return traineeService.register(registerTraineeDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
