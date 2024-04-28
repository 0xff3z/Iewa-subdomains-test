package iewa.api.Controller.BusinessOwner;


import iewa.api.Service.BusinessOwner.BusinessOwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/business-owner")
@RestController
public class BusinessOwnerController {

    @Autowired
    private BusinessOwnerService businessOwnerService;

    @GetMapping("profile")
    public ResponseEntity<?> getProfile(
            @AuthenticationPrincipal String username
    ) {
      try {
            return businessOwnerService.getProfile(username);
      } catch (Exception e) {

        return ResponseEntity.badRequest().body("Error");
      }
    }
}
