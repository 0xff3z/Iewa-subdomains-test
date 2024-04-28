package iewa.api.Controller.BusinessOwner;


import iewa.api.DTO.BusinessOwner.InterviewDTO;
import iewa.api.DTO.BusinessOwner.RejectDTO;
import iewa.api.Model.UserList;
import iewa.api.Service.BusinessOwner.ListService;
import iewa.api.Service.Monday;
import jakarta.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/business-owner/list")
public class ListController {


    private static final Logger log = LoggerFactory.getLogger(ListController.class);
    @Autowired
    private Monday monday;

    @Autowired
    private ListService listService;



    @PostMapping("/create/{id}/{type}")
    public ResponseEntity<?> create(
            @AuthenticationPrincipal String username,
            @PathVariable String id,
            @PathVariable UserList.Type type
    ){
        try {
            return this.listService.create(username,id,type);
        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body("Error");
        }
    }





    @PostMapping("/update/{id}/{type}")
    public ResponseEntity<?> update(
            @AuthenticationPrincipal String username,
            @PathVariable Long id,
            @PathVariable UserList.Type type,
            @RequestBody InterviewDTO interviewDTO
            ){
        try {
            return this.listService.update(username,id,type,interviewDTO);
        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body("Error");
        }
    }


    @GetMapping("/get")
    public ResponseEntity<?> get(
            @AuthenticationPrincipal String username
    ){
        try {
            return this.listService.get(username);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body("Error");
        }
    }


    @GetMapping("/marketplace")
    public ResponseEntity<?> getMarketplace(

    ){
        try {
            return this.listService.getMarketplace();
        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body("Error");
        }
    }


    @GetMapping("/get-my-list-ids")
    public ResponseEntity<?> getMyListIds(
            @AuthenticationPrincipal String username
    ){
        try {
            return this.listService.getMyListIds(username);
        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body("Error");
        }
    }


    @GetMapping("/get-iewa-list")
    public ResponseEntity<?> getIewaList(
            @AuthenticationPrincipal String username
    ){
        try {
            return this.listService.getIewaList(username);
        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body("Error");
        }
    }


    @GetMapping("/get-trainee")
    public ResponseEntity<?> getTrainee(
    ){
        try {
            return this.listService.getTraineeList();
        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body("Error");
        }
    }


    @PostMapping("/reqeust-candidate-info/{id}")
    public ResponseEntity<?> requestCandidateInfo(
            @AuthenticationPrincipal String username,
            @PathVariable String id
    ){
        try {
            return this.listService.requestCandidateInfo(username,id);
        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body("Error");
        }
    }


}
