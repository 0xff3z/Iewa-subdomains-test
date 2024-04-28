package iewa.api.Service.BusinessOwner;


import iewa.api.Config.ApiResponseDTO;
import iewa.api.DTO.BusinessOwner.CreateInterviewDTO;
import iewa.api.Model.BusinessOwner;
import iewa.api.Model.Candidate;
import iewa.api.Model.Interview;
import iewa.api.Repository.BusinessOwnerRepository;
import iewa.api.Repository.CandidateRepository;
import iewa.api.Repository.InterviewRepository;
import iewa.api.Service.Monday;
import jakarta.transaction.Transactional;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class JobInterviewService {

    private static final Logger log = LoggerFactory.getLogger(JobInterviewService.class);
    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private Monday monday;

    @Autowired
    private BusinessOwnerRepository businessOwnerRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Transactional
    public ResponseEntity<?> create(CreateInterviewDTO createInterviewDTO, String email) {
        try {
            BusinessOwner businessOwner = this.businessOwnerRepository.findByEmail(email);
            Candidate candidate = this.candidateRepository.findByMondayId(createInterviewDTO.getCandidateMondayId());
            HashMap<String, Object> interview = new HashMap<>();
            interview.put("date_1", createInterviewDTO.getDate());
            JSONObject hourValue = new JSONObject();
            hourValue.put("hour", Integer.parseInt(createInterviewDTO.getTime()));
            hourValue.put("minute", 0);

            interview.put("hour", hourValue);
            String interviewMondayId = this.monday.createInterview(interview, createInterviewDTO.getCandidateMondayId(), businessOwner.getMondayId(),candidate.getName());
            if (interviewMondayId != null) {
                Interview newInterview = Interview.builder()
                        .candidateMondayId(createInterviewDTO.getCandidateMondayId())
                        .businessOwnerMondayId(businessOwner.getMondayId())
                        .interviewMondayId(interviewMondayId)
                        .interviewTime(createInterviewDTO.getTime())
                        .candidate(candidate)
                        .businessOwner(businessOwner)
                        .listId(createInterviewDTO.getListId())
                        .interviewDate(createInterviewDTO.getDate())
                        .status(Interview.Status.بانتظار_تاكيد_المرشح)
                        .acceptionStatus(Interview.AcceptionStatus.قيد_المراجعة)
                        .build();
                this.interviewRepository.save(newInterview);
                return ResponseEntity.ok(new ApiResponseDTO<>(true, "Success", newInterview, 201));
            } else {
                return ResponseEntity.badRequest().body("Error");
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body("Error");
        }
    }


    @Transactional
    public ResponseEntity<?> update(CreateInterviewDTO createInterviewDTO, String email, Long id) {
        try {
            BusinessOwner businessOwner = this.businessOwnerRepository.findByEmail(email);
            Candidate candidate = this.candidateRepository.findByMondayId(createInterviewDTO.getCandidateMondayId());
            Interview interview = this.interviewRepository.findById(id).orElse(null);
            if (interview != null) {
                HashMap<String, Object> newInterview = new HashMap<>();
                newInterview.put("date_1", createInterviewDTO.getDate());
                JSONObject hourValue = new JSONObject();
                hourValue.put("hour", Integer.parseInt(createInterviewDTO.getTime()));
                hourValue.put("minute", 0);

                newInterview.put("hour", hourValue);
                boolean updated = this.monday.updateInterview(newInterview, interview.getInterviewMondayId());
                if (updated) {
                    interview.setInterviewTime(createInterviewDTO.getTime());
                    interview.setInterviewDate(createInterviewDTO.getDate());
                    this.interviewRepository.save(interview);
                    return ResponseEntity.ok(new ApiResponseDTO<>(true, "Success", interview, 200));
                } else {
                    return ResponseEntity.badRequest().body("Error");
                }
            } else {
                return ResponseEntity.badRequest().body("Error");
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body("Error");
        }
    }


}
