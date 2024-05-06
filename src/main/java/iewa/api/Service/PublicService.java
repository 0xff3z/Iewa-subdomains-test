package iewa.api.Service;


import iewa.api.Config.ApiResponseDTO;
import iewa.api.Model.LandingPageCandidate;
import iewa.api.Repository.LandingPageCandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PublicService {


    @Autowired
    private LandingPageCandidateRepository landingPageCandidateRepository;

    public ResponseEntity<?> getAllCandidates() {
        try {
            List<LandingPageCandidate> candidates = (List<LandingPageCandidate>) landingPageCandidateRepository.findAll();
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Candidates retrieved successfully",candidates, 200));
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
