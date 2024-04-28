package iewa.api.Service.BusinessOwner;


import iewa.api.Config.ApiResponseDTO;
import iewa.api.DTO.BusinessOwner.RequestCandidateDTO;
import iewa.api.Model.BusinessOwner;
import iewa.api.Model.Candidate;
import iewa.api.Model.CandidateRequest;
import iewa.api.Repository.BusinessOwnerRepository;
import iewa.api.Repository.CandidateRequestRepository;
import iewa.api.Service.Monday;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


@Service
public class CandidateRequestService {


    private static final Logger log = LoggerFactory.getLogger(CandidateRequestService.class);
    @Autowired
    private CandidateRequestRepository candidateRequestRepository;

    @Autowired
    private Monday monday;

    @Autowired
    private BusinessOwnerRepository businessOwnerRepository;


    @Autowired
    private RabbitTemplate rabbitTemplate;
    @Transactional

    public ResponseEntity<?> create(RequestCandidateDTO requestCandidateDTO, String email){
        try {
            BusinessOwner businessOwner = this.businessOwnerRepository.findByEmail(email);
            Map<String, String> columnValues = new HashMap<>();
            columnValues.put("job_title__1", requestCandidateDTO.getJobTitle());
            columnValues.put("skills__1", requestCandidateDTO.getRequiredSkills());
            columnValues.put("numbers_of_employee", "1");  // Assuming this is a constant value
            columnValues.put("job_level", requestCandidateDTO.getExperienceLevel());
            columnValues.put("long_text7", requestCandidateDTO.getJobResponsibilities());
            columnValues.put("long_text9", requestCandidateDTO.getJobRequirementsExperiences());
            columnValues.put("long_text1", requestCandidateDTO.getRequiredSkillsDetails());
            columnValues.put("working_days", requestCandidateDTO.getWorkHours());
            columnValues.put("when_", requestCandidateDTO.getWhenToStart());
            columnValues.put("employment_type6", requestCandidateDTO.getJobType());
            columnValues.put("english", requestCandidateDTO.getEnglishLevel());
            columnValues.put("salary_cap", requestCandidateDTO.getMaxSalary());
            columnValues.put("comment", requestCandidateDTO.getAdditionalNotes());

            String id = this.monday.createCandidateRequest(columnValues, businessOwner.getMondayId());
            CandidateRequest candidateRequest = new CandidateRequest();
            candidateRequest.setMondayId(id);
            candidateRequest.setSkills(requestCandidateDTO.getRequiredSkills());
            candidateRequest.setExperienceLevel(requestCandidateDTO.getExperienceLevel());
            candidateRequest.setJobRequirementsExperiences(requestCandidateDTO.getJobRequirementsExperiences());
            candidateRequest.setJobResponsibilities(requestCandidateDTO.getJobResponsibilities());
            candidateRequest.setSalaryCap(requestCandidateDTO.getMaxSalary());
            candidateRequest.setWorkingDays(requestCandidateDTO.getWorkHours());
            candidateRequest.setEmploymentType(requestCandidateDTO.getJobType());
            candidateRequest.setWhenToStart(requestCandidateDTO.getWhenToStart());
            candidateRequest.setJobTitle(requestCandidateDTO.getJobTitle());
            candidateRequest.setEnglishLevel(requestCandidateDTO.getEnglishLevel());
            candidateRequest.setNumberOfEmployees(1);
            candidateRequest.setAdditionalNotes(requestCandidateDTO.getAdditionalNotes());
            candidateRequest.setTechnicalSkills(requestCandidateDTO.getRequiredSkills());
            candidateRequest.setBusinessOwner(businessOwner);
            this.candidateRequestRepository.save(candidateRequest);


            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Success", candidateRequest, 200));
        }
        catch (Exception e){
           log.error("Error", e);
            return ResponseEntity.badRequest().body("Error");
        }
    }

    @Transactional
    public ResponseEntity<?> getCandidateRequest(String email){
        try {
            BusinessOwner businessOwner = this.businessOwnerRepository.findByEmail(email);
            ArrayList<CandidateRequest> candidateRequests = businessOwner.getCandidateRequests();
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Success", candidateRequests,200));

        } catch (Exception e) {
            log.error("Error", e);
            return ResponseEntity.badRequest().body("Error");
        }
    }


}
