package iewa.api.Controller;


import iewa.api.DTO.Trainee.RegisterTraineeDTO;
import iewa.api.Service.TraineeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/trainee")
public class TraineeController {
    @Autowired
    private TraineeService traineeService;

    @PostMapping("/register")
    public ResponseEntity<?> register(
           @RequestBody RegisterTraineeDTO registerTraineeDTO
    ) {
        try {
            return traineeService.register(registerTraineeDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }


    @PostMapping(value = "/upload/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @PathVariable("id") String id) {
        try {
            return traineeService.uploadFile(file, id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
