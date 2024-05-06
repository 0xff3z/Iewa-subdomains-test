package iewa.api.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class InterviewService {

    @Autowired
    Monday monday;

    @Scheduled(fixedRate = 300000)
    public void scheduleFixedRateTask() {
        this.monday.updateInterviewsFromMonday();
    }

}
