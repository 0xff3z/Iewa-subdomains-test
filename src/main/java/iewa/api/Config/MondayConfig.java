package iewa.api.Config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "monday")
@Component
@Data
public class MondayConfig {

    private String url;
    private String token;
    private String version;
    private int clientBoardId;
    private int talentBoardId;
    private int candidateRequestBoardId;
    private int interviewBoardId;
    private int invoiceBoardId;
    private int flutterCourseBoardId;
    private int traineeBoardId;
    private String clientGroupId;
    private String talentGroupId;
    private String candidateRequestGroupId;
    private String interviewGroupId;
    private String invoiceGroupId;
    private String flutterCourseGroupId;
    private String traineeGroupId;





}
