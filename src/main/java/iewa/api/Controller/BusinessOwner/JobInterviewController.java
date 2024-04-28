package iewa.api.Controller.BusinessOwner;


import iewa.api.DTO.BusinessOwner.CreateInterviewDTO;
import iewa.api.Service.BusinessOwner.JobInterviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/business-owner/job-interview")
public class JobInterviewController {

    private static final Logger log = LoggerFactory.getLogger(JobInterviewController.class);
    @Autowired
    private JobInterviewService jobInterviewService;


    @PostMapping("/create")
    public ResponseEntity<?> createInterview(
            @RequestBody CreateInterviewDTO createInterviewDTO, @AuthenticationPrincipal String username) {
            try {
                log.info("Create interview request");
                return this.jobInterviewService.create(createInterviewDTO, username);
            }
            catch (Exception e) {
                log.error(e.getMessage());
                return ResponseEntity.badRequest().body("Error");
            }
    }



    @PostMapping("/update/{id}")
    public ResponseEntity<?> updateInterview(
            @RequestBody CreateInterviewDTO createInterviewDTO, @AuthenticationPrincipal String username, @PathVariable Long id) {
        try {
            log.info("Update interview request");
            return this.jobInterviewService.update(createInterviewDTO, username, id);
        }
        catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body("Error");
        }
    }

}
