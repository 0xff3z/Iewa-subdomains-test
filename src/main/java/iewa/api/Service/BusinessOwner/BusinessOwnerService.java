package iewa.api.Service.BusinessOwner;

import iewa.api.Config.ApiResponseDTO;
import iewa.api.Model.BusinessOwner;
import iewa.api.Repository.BusinessOwnerRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class BusinessOwnerService {


    private static final Logger log = LoggerFactory.getLogger(BusinessOwnerService.class);
    @Autowired
    private BusinessOwnerRepository businessOwnerRepository;
    @Transactional
    public ResponseEntity<?> getProfile(String username) {
       try {
           BusinessOwner businessOwner = businessOwnerRepository.findByEmail(username);
           if (businessOwner == null) {
               return ResponseEntity.badRequest().body("User not found");
           }
           return ResponseEntity.ok(new ApiResponseDTO<>(true, "Success", businessOwner,200));
       }
         catch (Exception e) {
//           log.error("Error", e);
            return ResponseEntity.badRequest().body("Error");
         }
    }
}
