package iewa.api.Controller.BusinessOwner;
import iewa.api.DTO.BusinessOwner.RequestCandidateDTO;
import iewa.api.Service.BusinessOwner.CandidateRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/business-owner/request")
public class CandidateRequestController {



    @Autowired
    private CandidateRequestService candidateRequestService;


    @PostMapping("/create")
    public ResponseEntity<?> createCandidateRequest(@RequestBody  RequestCandidateDTO requestCandidateDTO, @AuthenticationPrincipal String username) {
       try {
            return this.candidateRequestService.create(requestCandidateDTO, username);
            }
         catch (Exception e) {
              return ResponseEntity.badRequest().body("Error");
         }
    }


    @GetMapping("/get")
    public ResponseEntity<?> getCandidateRequest(@AuthenticationPrincipal String username) {
        try {
            return this.candidateRequestService.getCandidateRequest(username);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error");
        }
    }



}
