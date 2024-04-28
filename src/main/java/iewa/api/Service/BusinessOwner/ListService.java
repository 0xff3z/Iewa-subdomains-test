package iewa.api.Service.BusinessOwner;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import iewa.api.Config.ApiResponseDTO;
import iewa.api.DTO.BusinessOwner.InterviewDTO;
import iewa.api.Model.*;
import iewa.api.Repository.*;
import iewa.api.Service.Monday;
import jakarta.transaction.Transactional;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ListService {

    private static final Logger log = LoggerFactory.getLogger(ListService.class);
    @Autowired
    private Monday monday;

    @Autowired
    private BusinessOwnerRepository businessOwnerRepository;

    @Autowired
    private ListRepository listRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private TraineeRepository traineeRepository;

    @Autowired
    private InterviewRepository interviewRepository;


    @Transactional
    public ResponseEntity<?> create(String username, String id, UserList.Type type){
        try {
            BusinessOwner businessOwner = this.businessOwnerRepository.findByEmail(username);
            UserList existList = this.listRepository.findByCandidateMondayIdAndBusinessOwnerMondayId(id,businessOwner.getMondayId());
            if (existList != null){
                return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false,"The list already exists",null,400));
            }
            Candidate candidate = this.candidateRepository.findByMondayId(id);
            log.info("Candidate: " + candidate);
             UserList list = new UserList();
            list.setBusinessOwner(businessOwner);
            list.setCandidateMondayId(id);
            list.setBusinessOwnerMondayId(businessOwner.getMondayId());
            list.setType(type);
            list.setCandidate(candidate);
            this.listRepository.save(list);

            String mondayId = businessOwner.getMondayId();
            rabbitTemplate.convertAndSend("sync_monday", "routing_key", mondayId);
            businessOwnerRepository.save(businessOwner);

            return ResponseEntity.ok(new ApiResponseDTO<>(true,"The list has been created",null,201));
        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false,"Error",null,400));
        }
    }
    @Transactional
    public ResponseEntity<?> update(String username, Long id, UserList.Type type, InterviewDTO interviewDTO) {
        try {
            BusinessOwner businessOwner = this.businessOwnerRepository.findByEmail(username);
            Optional<UserList> list = this.listRepository.findById(id);
            if (list.get().getType() == UserList.Type.ACCEPTED_LIST) {
                String mondayId = businessOwner.getMondayId();
                Interview interview = interviewRepository.findById(Long.parseLong(interviewDTO.getInterviewId()));
                interview.setAcceptionStatus(Interview.AcceptionStatus.مقبول);
                this.interviewRepository.save(interview);
                rabbitTemplate.convertAndSend("sync_monday", "routing_key", mondayId);

                return ResponseEntity.ok(new ApiResponseDTO<>(true, "The list has been updated", null, 200));

            }
            if (list.isPresent() && list.get().getBusinessOwner().getId() == businessOwner.getId()) {
                list.get().setType(type);
                this.listRepository.save(list.get());
                businessOwnerRepository.save(businessOwner);


            } else {
                return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false, "The list does not exist", null, 400));
            }

            String mondayId = businessOwner.getMondayId();
            rabbitTemplate.convertAndSend("sync_monday", "routing_key", mondayId);
            JSONObject object = new JSONObject();
            object.put("id", list.get().getCandidateMondayId());
            object.put("type", type);
            object.put("companyName", businessOwner.getCompanyName());
            object.put("reason", interviewDTO.getReason());
            rabbitTemplate.convertAndSend("sync_item_update", object.toString());

//            String update = this.monday.createItemUpdate(list.get().getCandidateMondayId(), type, businessOwner.getCompanyName(),interviewDTO.getReason());

            return ResponseEntity.ok(new ApiResponseDTO<>(true, "The list has been updated", null, 200));
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false, "Error", null, 400));
        }
    }
    @Transactional
    public ResponseEntity<?> get(String username){
        try {

            BusinessOwner businessOwner = this.businessOwnerRepository.findByEmail(username);
            List<UserList> shortList = businessOwner.getUserList(UserList.Type.SHORT_LIST);
            List<UserList> myList = businessOwner.getUserList(UserList.Type.MY_LIST);
            List<UserList> acceptedList = businessOwner.getUserList(UserList.Type.ACCEPTED_LIST);
            List<UserList> rejectedList = businessOwner.getUserList(UserList.Type.REJECTED_LIST);
            List<Interview> interviews = businessOwner.getNotAcceptedInterview();
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode lists = mapper.createObjectNode();
            lists.put("shortList",mapper.valueToTree(shortList));
            lists.put("myList",mapper.valueToTree(myList));
            lists.put("acceptedList",mapper.valueToTree(acceptedList));
            lists.put("rejectedList",mapper.valueToTree(rejectedList));
            lists.put("interviews",mapper.valueToTree(interviews));
            return ResponseEntity.ok(new ApiResponseDTO<>(true,"The lists have been created",lists,200));


        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false,"Error",null,400));
        }
    }




    public ResponseEntity<?> getMarketplace(){
        try {
            List<Candidate> candidates = this.candidateRepository.findAll();
            return ResponseEntity.ok(new ApiResponseDTO<>(true,"The list has been created",candidates,200));
        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false,"Error",null,400));
        }
    }

    @Transactional
    public ResponseEntity<?> getMyListIds(String username){
        try {
            BusinessOwner businessOwner = this.businessOwnerRepository.findByEmail(username);
            List<Integer> allListsId = businessOwner.getAllListIds();
            return ResponseEntity.ok(new ApiResponseDTO<>(true,"The list has been created",allListsId,200));
        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false,"Error",null,400));
        }
    }

    @Transactional
    public ResponseEntity<?> getIewaList (String email) {
        try {
            BusinessOwner businessOwner = this.businessOwnerRepository.findByEmail(email);

            rabbitTemplate.convertAndSend("sync_monday_iewa_list", "routing_key", businessOwner.getMondayId());
            List<UserList> iewaList = businessOwner.getUserList(UserList.Type.IEWA_LIST);
            return ResponseEntity.ok(new ApiResponseDTO<>(true,"The list has been created",iewaList,200));

        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false,"Error",null,400));
        }
    }

    @Transactional
    public ResponseEntity<?> getTraineeList () {
        try {
            List<Trainee> trainee = (List<Trainee>) this.traineeRepository.findAll();
            return ResponseEntity.ok(new ApiResponseDTO<>(true,"The list has been created",trainee,200));
        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false,"Error",null,400));
        }
    }

    @Transactional
    public ResponseEntity<?> requestCandidateInfo(String username, String id){
        try {
            BusinessOwner businessOwner = this.businessOwnerRepository.findByEmail(username);
            UserList list = this.listRepository.findById(Long.parseLong(id)).get();
            String mondayId = businessOwner.getMondayId();
            String createdId = this.monday.RequestCandidateInfo(mondayId,list.getCandidateMondayId(),businessOwner.getCompanyName());
            list.setIsRequestedInfo(true);
            listRepository.save(list);

            return ResponseEntity.ok(new ApiResponseDTO<>(true,"The request has been sent",null,200));
        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false,"Error",null,400));
        }
    }


}
