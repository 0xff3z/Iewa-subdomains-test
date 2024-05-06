package iewa.api.Service;


import iewa.api.Model.BusinessOwner;
import iewa.api.Model.Candidate;
import iewa.api.Model.Interview;
import iewa.api.Model.UserList;
import iewa.api.Repository.BusinessOwnerRepository;
import iewa.api.Repository.CandidateRepository;
import iewa.api.Repository.InterviewRepository;
import iewa.api.Repository.ListRepository;
import jakarta.transaction.Transactional;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class Dataload {

    private static final Logger log = LoggerFactory.getLogger(Dataload.class);
    @Autowired
    private BusinessOwnerRepository businessOwnerRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private ListRepository listRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    @Transactional
    public void createListForUsersFromCSV() {
        try {
            String csvFilePath = "src/Data/interview.csv";

            Reader reader = Files.newBufferedReader(Paths.get(csvFilePath));
            CSVParser csvParser = CSVFormat.DEFAULT.withHeader().parse(reader);

            for (CSVRecord record : csvParser) {
                String businessOwnerPhoneNumber = record.get("businessOwnerPhoneNumber");
                String candidateMondayId = record.get("candidateId");
                String interviewMondayId = record.get("mondayId");
                String interviewDate = record.get("date");
                String interviewTime = record.get("time");
                Interview.Status status = Interview.Status.fromString(record.get("status"));
                BusinessOwner businessOwner = businessOwnerRepository.findByPhoneNumber(businessOwnerPhoneNumber);
                if (businessOwner == null) {
                    log.info("Business owner not found");
                    continue;
                }
                Candidate candidate1 = candidateRepository.findByMondayId(candidateMondayId);
                Interview interview = new Interview();
                interview.setBusinessOwner(businessOwner);
                interview.setCandidate(candidate1);
                interview.setInterviewDate(interviewDate);
                interview.setInterviewTime(interviewTime);
                interview.setInterviewMondayId(interviewMondayId);
                interview.setStatus(status);
                interview.setBusinessOwnerMondayId(businessOwner.getMondayId());
                interview.setCandidateMondayId(candidate1.getMondayId());
                interview.setAcceptionStatus(Interview.AcceptionStatus.قيد_المراجعة);

                interviewRepository.save(interview);

            }



            csvParser.close();
            reader.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
