package iewa.api.Service.BusinessOwner;

import iewa.api.Repository.BusinessOwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class BusinessOwnerService {


    @Autowired
    private BusinessOwnerRepository businessOwnerRepository;
    public ResponseEntity<?> getProfile(String username) {
       try {
            return ResponseEntity.ok(businessOwnerRepository.findByEmail(username));
       }
         catch (Exception e) {
            return ResponseEntity.badRequest().body("Error");
         }
    }
}
