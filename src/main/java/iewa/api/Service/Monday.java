package iewa.api.Service;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.shaded.gson.Gson;
import com.nimbusds.jose.shaded.gson.JsonArray;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import iewa.api.Config.MondayConfig;
import iewa.api.Model.*;
import iewa.api.Repository.*;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;

import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
@Log4j2
public class Monday {

    @Autowired
    private MondayConfig mondayConfig;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private BusinessOwnerRepository businessOwnerRepository;

    @Autowired
    private TraineeRepository traineeRepository;

    @Autowired
    private LandingPageCandidateRepository landingPageCandidateRepository;



    public String createItem(int boardId, String itemName, String groupId, Map<String, String> columnValues){
        try {
            JSONObject json = new JSONObject(columnValues);

            String columnValuesString = json.toString().replace("\"", "\\\"");
            String mutation = String.format("mutation { create_item( board_id: %d, group_id: \"%s\", item_name: \"%s\", column_values: \"%s\" ) { id } }",
                    boardId, groupId, itemName, columnValuesString);
            log.info(mutation);

            String url = "https://api.monday.com/v2";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", this.mondayConfig.getToken());

            Map<String, Object> body = new HashMap<>();
            body.put("query", mutation);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            String response = restTemplate.postForObject(url, request, String.class);
            JSONObject jsonResponse = new JSONObject(response);
            log.info(jsonResponse);
            String itemId = jsonResponse.getJSONObject("data").getJSONObject("create_item").getString("id");
            return itemId;


        }
        catch (Exception e){
            return "Error: " + e.getMessage();
        }
    }


    public void deleteItem(int itemId) {
        try {
            String mutation = String.format("mutation { delete_item( item_id: %d ) { id } }", itemId);

            String url = "https://api.monday.com/v2";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", this.mondayConfig.getToken());

            Map<String, Object> body = new HashMap<>();
            body.put("query", mutation);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            String response = restTemplate.postForObject(url, request, String.class);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

    }

    public String SyncListItems(String itemId, ArrayList<Integer> shortList, ArrayList<Integer> myList, ArrayList<Integer> acceptList, ArrayList<Integer> rejectList,ArrayList<Integer> iewaList) {
        try {
            Gson gson = new Gson();
            String shortListJson = gson.toJson(shortList);
            String myListJson = gson.toJson(myList);
            String acceptListJson = gson.toJson(acceptList);
            String rejectListJson = gson.toJson(rejectList);
            String iewaListJson = gson.toJson(iewaList);

            String columnValuesJson = String.format("{\"connect_boards9\":{\"item_ids\":%s,\"board_id\":1399424616},\"connect_boards19\":{\"item_ids\":%s,\"board_id\":1399424616},\"connect_boards95\":{\"item_ids\":%s,\"board_id\":1399424616},\"connect_boards953\":{\"item_ids\":%s,\"board_id\":1399424616},\"connect_boards5\":{\"item_ids\":%s,\"board_id\":1399424616}}",
                    shortListJson, myListJson, acceptListJson, rejectListJson, iewaListJson);

            String escapedColumnValuesJson = columnValuesJson.replace("\"", "\\\"");

            String mutation = String.format("mutation { change_multiple_column_values(item_id:%s, board_id:1399424616, column_values: \"%s\") { id } }", itemId, escapedColumnValuesJson);

            String url = "https://api.monday.com/v2";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", this.mondayConfig.getToken());

            Map<String, Object> body = new HashMap<>();
            body.put("query", mutation);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            String response = restTemplate.postForObject(url, request, String.class);
            String itemIdResponse = new JSONObject(response).getJSONObject("data").getJSONObject("change_multiple_column_values").getString("id");
            return itemIdResponse;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return "Error: " + e.getMessage();
        }
    }


    public String createInterview(Map<String, Object> columnValues, String candidateId, String businessOwnerId,String candidateName) {
        try {
            JSONObject json = new JSONObject();
            json.put("connect_boards", new JSONObject().put("item_ids", new JSONArray().put(candidateId)));
            json.put("connect_boards6", new JSONObject().put("item_ids", new JSONArray().put(businessOwnerId)));
            for (Map.Entry<String, Object> entry : columnValues.entrySet()) {
                json.put(entry.getKey(), entry.getValue());
            }

            String columnValuesString = json.toString();
            String mutation = String.format("mutation { create_item( board_id: %d, group_id: \"%s\", item_name: \"%s\", column_values: \"%s\" ) { id } }",
                    1392724674, "topics", candidateName, columnValuesString.replace("\"", "\\\""));  // Escape double quotes

            log.info(mutation);
            String url = "https://api.monday.com/v2";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", this.mondayConfig.getToken());
            Map<String, Object> body = new HashMap<>();
            body.put("query", mutation);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            String response = restTemplate.postForObject(url, request, String.class);
            log.info(response);
            JSONObject jsonResponse = new JSONObject(response);
            String itemId = jsonResponse.getJSONObject("data").getJSONObject("create_item").getString("id");
            return itemId;
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }


    public Boolean updateInterview(Map<String, Object> columnValues, String itemId) {
        try {
            JSONObject json = new JSONObject();
            for (Map.Entry<String, Object> entry : columnValues.entrySet()) {
                json.put(entry.getKey(), entry.getValue());
            }

            String columnValuesString = json.toString();
            String mutation = String.format("mutation { change_multiple_column_values(item_id: %s, board_id: %d, column_values: \"%s\") { id } }",
                    itemId, 1392724674, columnValuesString.replace("\"", "\\\""));

            log.info(mutation);
            String url = "https://api.monday.com/v2";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", this.mondayConfig.getToken());
            Map<String, Object> body = new HashMap<>();
            body.put("query", mutation);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            String response = restTemplate.postForObject(url, request, String.class);
            log.info(response);
            JSONObject jsonResponse = new JSONObject(response);
            String updatedItemId = jsonResponse.getJSONObject("data").getJSONObject("change_multiple_column_values").getString("id");
            return updatedItemId.equals(itemId);
        } catch (Exception e) {
            return false;
        }

    }





    public String createItemUpdate(String itemId, UserList.Type type, String companyName, String reason) {
        try {
            String updateBody = String.format("تحديث جديد من %s بخصوص %s: %s", companyName, type, reason);

            String mutation = String.format("mutation {\n" +
                    "  create_update(item_id: %s, body: \"%s\") {\n" +
                    "    id\n" +
                    "  }\n" +
                    "}\n", itemId, updateBody);

            String url = "https://api.monday.com/v2";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", this.mondayConfig.getToken());

            Map<String, Object> body = new HashMap<>();
            body.put("query", mutation);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            // Execute the GraphQL mutation via POST request
            String response = restTemplate.postForObject(url, request, String.class);
            log.info(response);

            return "Update created successfully";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    public void createCandidates() {
        try {
            String cursor = null;
            ArrayList<Candidate> candidates = new ArrayList<>();
            do {
                String query = "query { boards(ids: [1445511186]) { groups(ids: [\"test_ewa_xlsx77277\"]) { items_page(" +
                        (cursor != null ? "cursor: \"" + cursor + "\", limit: 500" : "limit: 500, query_params: { order_by: [{ column_id: \"name\" }] }") +
                        ") { cursor items { name id column_values { id value ... on StatusValue { text } ... on DropdownValue { text } } } } } } }";

                String url = "https://api.monday.com/v2";
                RestTemplate restTemplate = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Authorization", this.mondayConfig.getToken());
                Map<String, Object> body = new HashMap<>();
                body.put("query", query);
                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
                String response = restTemplate.postForObject(url, request, String.class);

                JSONObject responseData = new JSONObject(response);
                JSONObject itemsPage = responseData.getJSONObject("data").getJSONArray("boards").getJSONObject(0).getJSONArray("groups").getJSONObject(0).getJSONObject("items_page");
                cursor = itemsPage.optString("cursor");

                JSONArray itemsArray = itemsPage.getJSONArray("items");

                log.info("Items: " + itemsArray.length());
                for (int i = 0; i < itemsArray.length(); i++) {
                    Candidate existingCandidate = candidateRepository.findByMondayId(itemsArray.getJSONObject(i).getString("id"));
                    if (existingCandidate != null) {
                        continue;
                    }
                    JSONObject item = itemsArray.getJSONObject(i);
                    Candidate candidate = new Candidate();

                    candidate.setName(item.getString("name"));

                    JSONArray columnValues = item.getJSONArray("column_values");
                    for (int j = 0; j < columnValues.length(); j++) {
                        JSONObject column = columnValues.getJSONObject(j);
                        String id = column.getString("id");
                        String value = column.optString("value", null);
                        candidate.setMondayId(item.getString("id"));

                        switch (id) {
                            case "phone__1":
                                if (value == null || value.equals("null") || JSONObject.NULL.equals(value)) {
                                    break;
                                }
                                candidate.setFirstName(new JSONObject(value).optString("phone"));
                                break;
                            case "position":
                                if (value == null || value.equals("null") || JSONObject.NULL.equals(value)) {
                                    break;
                                }
                                candidate.setJob(value.replace("\"", ""));
                                break;
                            case "long_text":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longTextObj = new JSONObject(value);
                                    if (longTextObj.has("text")) {
                                        candidate.setBio(longTextObj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text2":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText2Obj = new JSONObject(value);
                                    if (longText2Obj.has("text")) {
                                        candidate.setYearsOfExperience(longText2Obj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text6":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText6Obj = new JSONObject(value);
                                    if (longText6Obj.has("text")) {
                                        candidate.setYearsOfExperienceTwo(longText6Obj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text0":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText0Obj = new JSONObject(value);
                                    if (longText0Obj.has("text")) {
                                        candidate.setYearsOfExperienceThree(longText0Obj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text66":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText66Obj = new JSONObject(value);
                                    if (longText66Obj.has("text")) {
                                        candidate.setYearsOfExperienceFour(longText66Obj.getString("text"));
                                    }
                                }
                                break;
                            case "status6":

                                candidate.setCurrency(column.optString("text"));
                                break;
                            case "long_text5":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText5Obj = new JSONObject(value);
                                    if (longText5Obj.has("text")) {
                                        candidate.setEducation(longText5Obj.getString("text"));
                                    }
                                }
                                break;
                            case "numbers4":
                                if (value == null || value.equals("null") || JSONObject.NULL.equals(value)) {
                                    break;
                                }
                                candidate.setExpectedSalary(value.replace("\"", ""));
                                break;
                            case "status7":
                                candidate.setNationality(column.optString("text"));
                                break;
                            case "long_text9":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText9Obj = new JSONObject(value);
                                    if (longText9Obj.has("text")) {
                                        candidate.setCourses(longText9Obj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text7":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText7Obj = new JSONObject(value);
                                    if (longText7Obj.has("text")) {
                                        candidate.setSkills(longText7Obj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text4":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText4Obj = new JSONObject(value);
                                    if (longText4Obj.has("text")) {
                                        candidate.setProject(longText4Obj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text45":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText45Obj = new JSONObject(value);
                                    if (longText45Obj.has("text")) {
                                        candidate.setProjectTwo(longText45Obj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text60":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText60Obj = new JSONObject(value);
                                    if (longText60Obj.has("text")) {
                                        candidate.setProjectThree(longText60Obj.getString("text"));
                                    }
                                }
                                break;
                            case "numbers1":
                                if (value == null || value.equals("null") || JSONObject.NULL.equals(value)) {
                                    break;
                                }
                                candidate.setNp(value.replace("\"", ""));
                                break;
                        }
                    }




                        candidateRepository.save(candidate);
                }




            } while (cursor != null && !cursor.isEmpty());







        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
    public void createLandingPageCandidates() {
        try {
            String cursor = null;
            do {
                String query = "query { boards(ids: [1445511186]) { groups(ids: [\"topics\"]) { items_page(" +
                        (cursor != null ? "cursor: \"" + cursor + "\", limit: 500" : "limit: 500, query_params: { order_by: [{ column_id: \"name\" }] }") +
                        ") { cursor items { name id column_values { id value ... on StatusValue { text } ... on DropdownValue { text } } } } } } }";

                String url = "https://api.monday.com/v2";
                RestTemplate restTemplate = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Authorization", this.mondayConfig.getToken());
                Map<String, Object> body = new HashMap<>();
                body.put("query", query);
                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
                String response = restTemplate.postForObject(url, request, String.class);

                JSONObject responseData = new JSONObject(response);
                JSONObject itemsPage = responseData.getJSONObject("data").getJSONArray("boards").getJSONObject(0).getJSONArray("groups").getJSONObject(0).getJSONObject("items_page");
                cursor = itemsPage.optString("cursor");

                JSONArray itemsArray = itemsPage.getJSONArray("items");

                log.info("Items: " + itemsArray.length());
                for (int i = 0; i < itemsArray.length(); i++) {
                    Candidate existingCandidate = candidateRepository.findByMondayId(itemsArray.getJSONObject(i).getString("id"));
                    if (existingCandidate != null) {
                        continue;
                    }
                    JSONObject item = itemsArray.getJSONObject(i);
                    LandingPageCandidate candidate = new LandingPageCandidate();

                    candidate.setName(item.getString("name"));

                    JSONArray columnValues = item.getJSONArray("column_values");
                    for (int j = 0; j < columnValues.length(); j++) {
                        JSONObject column = columnValues.getJSONObject(j);
                        String id = column.getString("id");
                        String value = column.optString("value", null);
                        candidate.setMondayId(item.getString("id"));

                        switch (id) {
                            case "phone__1":
                                if (value == null || value.equals("null") || JSONObject.NULL.equals(value)) {
                                    break;
                                }
                                candidate.setFirstName(new JSONObject(value).optString("phone"));
                                break;
                            case "position":
                                if (value == null || value.equals("null") || JSONObject.NULL.equals(value)) {
                                    break;
                                }
                                candidate.setJob(value.replace("\"", ""));
                                break;
                            case "long_text":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longTextObj = new JSONObject(value);
                                    if (longTextObj.has("text")) {
                                        candidate.setBio(longTextObj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text2":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText2Obj = new JSONObject(value);
                                    if (longText2Obj.has("text")) {
                                        candidate.setYearsOfExperience(longText2Obj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text6":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText6Obj = new JSONObject(value);
                                    if (longText6Obj.has("text")) {
                                        candidate.setYearsOfExperienceTwo(longText6Obj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text0":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText0Obj = new JSONObject(value);
                                    if (longText0Obj.has("text")) {
                                        candidate.setYearsOfExperienceThree(longText0Obj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text66":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText66Obj = new JSONObject(value);
                                    if (longText66Obj.has("text")) {
                                        candidate.setYearsOfExperienceFour(longText66Obj.getString("text"));
                                    }
                                }
                                break;
                            case "status6":

                                candidate.setCurrency(column.optString("text"));
                                break;
                            case "long_text5":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText5Obj = new JSONObject(value);
                                    if (longText5Obj.has("text")) {
                                        candidate.setEducation(longText5Obj.getString("text"));
                                    }
                                }
                                break;
                            case "numbers4":
                                if (value == null || value.equals("null") || JSONObject.NULL.equals(value)) {
                                    break;
                                }
                                candidate.setExpectedSalary(value.replace("\"", ""));
                                break;
                            case "status7":
                                candidate.setNationality(column.optString("text"));
                                break;
                            case "long_text9":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText9Obj = new JSONObject(value);
                                    if (longText9Obj.has("text")) {
                                        candidate.setCourses(longText9Obj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text7":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText7Obj = new JSONObject(value);
                                    if (longText7Obj.has("text")) {
                                        candidate.setSkills(longText7Obj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text4":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText4Obj = new JSONObject(value);
                                    if (longText4Obj.has("text")) {
                                        candidate.setProject(longText4Obj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text45":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText45Obj = new JSONObject(value);
                                    if (longText45Obj.has("text")) {
                                        candidate.setProjectTwo(longText45Obj.getString("text"));
                                    }
                                }
                                break;
                            case "long_text60":
                                if (value != null && !value.equals("null")) {
                                    JSONObject longText60Obj = new JSONObject(value);
                                    if (longText60Obj.has("text")) {
                                        candidate.setProjectThree(longText60Obj.getString("text"));
                                    }
                                }
                                break;
                            case "numbers1":
                                if (value == null || value.equals("null") || JSONObject.NULL.equals(value)) {
                                    break;
                                }
                                candidate.setNp(value.replace("\"", ""));
                                break;
                        }
                    }




                    landingPageCandidateRepository.save(candidate);
                }




            } while (cursor != null && !cursor.isEmpty());







        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }


    public String createCandidateRequest(Map<String, String> columnValues, String businessOwnerId) {
        try {
            JSONObject json = new JSONObject(columnValues);
            BusinessOwner businessOwner = businessOwnerRepository.findByMondayId(businessOwnerId);
            json.put("connect_boards6", new JSONObject().put("item_ids", new JSONArray().put(businessOwnerId)));

            String columnValuesString = json.toString().replace("\"", "\\\"");
            String mutation = String.format("mutation { create_item( board_id: %d, group_id: \"%s\", item_name: \"%s\", column_values: \"%s\" ) { id } }",
                    1392725521, "topics", businessOwner.getCompanyName(), columnValuesString);
            log.info(mutation);
            String url = "https://api.monday.com/v2";

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", this.mondayConfig.getToken());
            Map<String, Object> body = new HashMap<>();
            body.put("query", mutation);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            String response = restTemplate.postForObject(url, request, String.class);
            JSONObject jsonResponse = new JSONObject(response);
            log.info(jsonResponse);
            String itemId = jsonResponse.getJSONObject("data").getJSONObject("create_item").getString("id");
            return itemId;

        }
        catch (Exception e){
            log.error(e.getMessage());
            return "Error: " + e.getMessage();
        }
    }



    public String RequestCandidateInfo(String businessOwnerId,String candidateId,String candidateName) {
        try {
            JSONObject json = new JSONObject();
            json.put("connect_boards2", new JSONObject().put("item_ids", new JSONArray().put(businessOwnerId)));
            json.put("connect_boards__1", new JSONObject().put("item_ids", new JSONArray().put(candidateId)));

            String columnValuesString = json.toString().replace("\"", "\\\"");
            String mutation = String.format("mutation { create_item( board_id: %d, group_id: \"%s\", item_name: \"%s\", column_values: \"%s\" ) { id } }",
                    1484977551, "new_group97015", candidateName, columnValuesString);
            log.info(mutation);
            String url = "https://api.monday.com/v2";

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", this.mondayConfig.getToken());
            Map<String, Object> body = new HashMap<>();
            body.put("query", mutation);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            String response = restTemplate.postForObject(url, request, String.class);
            log.info(response);
            JSONObject jsonResponse = new JSONObject(response);
            String itemId = jsonResponse.getJSONObject("data").getJSONObject("create_item").getString("id");
            return itemId;

        }
        catch (Exception e){
            log.error(e.getMessage());
            return "Error: " + e.getMessage();
        }
    }



    public ArrayList<Integer> getIewaList(String businessOwnerId){
        try {
            String queryTemplate = "query {\n" +
                    "            items (ids: [%d]) {\n" +
                    "                column_values (ids: [\"connect_boards5\"]) {\n" +
                    "                    ... on BoardRelationValue {\n" +
                    "                        linked_item_ids\n" +
                    "                        linked_items {\n" +
                    "                            id\n" +
                    "                            name\n" +
                    "                        }\n" +
                    "                    }\n" +
                    "                }\n" +
                    "            }\n" +
                    "        }";
            String query = String.format(queryTemplate, Integer.parseInt(businessOwnerId));
            String url = "https://api.monday.com/v2";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", this.mondayConfig.getToken());
            Map<String, Object> body = new HashMap<>();
            body.put("query", query);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            String response = restTemplate.postForObject(url, request, String.class);
            JSONObject jsonResponse = new JSONObject(response);
            JSONArray linkedItemIds = jsonResponse.getJSONObject("data").getJSONArray("items").getJSONObject(0).getJSONArray("column_values").getJSONObject(0).getJSONArray("linked_item_ids");

            ArrayList<Integer> result = new ArrayList<>();
            for (int i = 0; i < linkedItemIds.length(); i++) {
                result.add(linkedItemIds.getInt(i));
            }
            return result;
        }
        catch (Exception e){
            log.error(e.getMessage());
            return null;
        }
    }


    public ArrayList<?> getInvoices(String businessMondayId) {
        try {
            String queryTemplate = "query {\n" +
                    "  items (ids:[%d]) {\n" +
                    "    column_values (ids: [\"connect_boards6\"]) {\n" +
                    "      ... on BoardRelationValue {\n" +
                    "        linked_item_ids\n" +
                    "        linked_items {\n" +
                    "          id\n" +
                    "          name\n" +
                    "          column_values {\n" +
                    "          id\n" +
                    "                value\n" +
                    "            ... on StatusValue {\n" +
                    "              text\n" +
                    "            }\n" +
                    "            ... on TextValue {\n" +
                    "              text\n" +
                    "            }\n" +
                    "              ... on FileValue {\n" +
                    "                    files\n" +
                    "                    id\n" +
                    "                    \n" +
                    "                }\n" +
                    "            ... on DateValue {\n" +
                    "              date\n" +
                    "            }\n" +
                    "          }\n" +
                    "        }\n" +
                    "      }\n" +
                    "    }\n" +
                    "  }\n" +
                    "}";
            String query = String.format(queryTemplate, Integer.parseInt(businessMondayId));

            String url = "https://api.monday.com/v2";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", this.mondayConfig.getToken());
            Map<String, Object> body = new HashMap<>();
            body.put("query", query);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            String response = restTemplate.postForObject(url, request, String.class);
            JSONObject responseData = new JSONObject(response);
            JSONArray itemsArray = responseData.getJSONObject("data").getJSONArray("items").getJSONObject(0).getJSONArray("column_values").getJSONObject(0).getJSONArray("linked_items");

            BusinessOwner businessOwner = businessOwnerRepository.findByMondayId(businessMondayId);
            log.info("Items: " + itemsArray.length());
            for (int i = 0; i < itemsArray.length(); i++) {
                Invoice existingInvoice = invoiceRepository.findByInvoiceMondayId(itemsArray.getJSONObject(i).getString("id"));
                if (existingInvoice != null) {
                    continue;
                }
                JSONObject item = itemsArray.getJSONObject(i);
                Invoice invoice = new Invoice();
                invoice.setInvoiceMondayId(item.getString("id"));
                invoice.setBusinessOwner(businessOwner);
                JSONArray columnValues = item.getJSONArray("column_values");
                for (int j = 0; j < columnValues.length(); j++) {
                    JSONObject column = columnValues.getJSONObject(j);
                    String id = column.getString("id");
                    String value = column.getString("value");

                    switch (id) {
                        case "text":
                            if (value == null || value.equals("null")) {
                                break;
                            }
                            invoice.setInvoiceId(value.replace("\"", ""));
                            break;
                        case "status1":
                             log.info("Extracted Status 1 Text: " + column.getString("text"));

                             if (column.getString("text") != null && !column.getString("text").equals("null")) {
                                invoice.setInvoiceType(column.getString("text"));
                            }

                            break;
                        case "status_1":
                            if (column.getString("text") != null && !column.getString("text").equals("null")) {
                                invoice.setInvoiceStatus(column.getString("text"));
                            }
                            break;




                        case "date4":
                            if (value != null && !value.equals("null")) {
                                JSONObject dateObj = new JSONObject(value);
                                if (dateObj.has("date")) {
                                    invoice.setInvoiceDate(dateObj.getString("date"));
                                }
                            }
                            break;
                        case "numbers5":
                            if (value == null || value.equals("null")) {
                                break;
                            }
                            invoice.setInvoiceAmount(value.replace("\"", ""));
                            break;
                        case "files":
                            if (value != null && !value.equals("null")) {
                                JSONObject fileObj = new JSONObject(value);
                                if (fileObj.has("files")) {
                                    JSONArray filesArray = fileObj.getJSONArray("files");
                                    if (filesArray.length() > 0) {
                                        JSONObject firstFile = filesArray.getJSONObject(0);
                                        if (firstFile.has("assetId")) {
                                            String assetId = firstFile.getString("assetId");
                                            invoice.setInvoiceAssetUrl(assetId);
                                        }
                                    }
                                }
                            }
                            break;

                    }


                }
                invoiceRepository.save(invoice);


            }
            return null;

        }
        catch (Exception e){
            log.error(e.getMessage());
            return null;
        }
    }



    public String generateAssetUrl(String assetId) {
        try {
            String query = String.format("query { assets(ids: [%s]) { id name public_url } }", assetId);
            String url = "https://api.monday.com/v2";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", this.mondayConfig.getToken());
            Map<String, Object> body = new HashMap<>();
            body.put("query", query);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            String response = restTemplate.postForObject(url, request, String.class);
            JSONObject responseData = new JSONObject(response);
            log.info(responseData);
            JSONObject asset = responseData.getJSONObject("data").getJSONArray("assets").getJSONObject(0);
            log.info(asset);
            return asset.getString("public_url");

        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }



    public ArrayList<?> getAllTrainees() {
        try {
            String query = "query { boards(ids: [1392728485]) { groups(ids: [\"topics\"]) { items_page(limit: 500, query_params: { order_by: [{ column_id: \"name\" }] }) { items { name id column_values { id value ... on StatusValue { text } ... on DropdownValue { text } } } } } } }";

            String url = "https://api.monday.com/v2";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", this.mondayConfig.getToken());
            Map<String, Object> body = new HashMap<>();
            body.put("query", query);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            String response = restTemplate.postForObject(url, request, String.class);

            JSONObject responseData = new JSONObject(response);
            JSONObject itemsPage = responseData.getJSONObject("data").getJSONArray("boards").getJSONObject(0).getJSONArray("groups").getJSONObject(0).getJSONObject("items_page");
            JSONArray itemsArray = itemsPage.getJSONArray("items");


            for (int i = 0; i < itemsArray.length(); i++) {
                Trainee existingTrainee = traineeRepository.findByMondayId(itemsArray.getJSONObject(i).getString("id"));
                if (existingTrainee != null) {
                    continue;
                }
                JSONObject item = itemsArray.getJSONObject(i);
                Trainee trainee = new Trainee();
                trainee.setMondayId(item.getString("id"));
                trainee.setName(item.getString("name"));
                JSONArray columnValues = item.getJSONArray("column_values");
                for (int j = 0; j < columnValues.length(); j++) {
                    JSONObject column = columnValues.getJSONObject(j);
                    String id = column.getString("id");
                    String value = column.optString("value", null);



                    switch (id) {
                        case "status6":
                                trainee.setGender(column.optString("text"));
                            break;
                        case "email":
                            trainee.setEmail(value.replace("\"", ""));
                            break;
                        case "long_text":
                            trainee.setAboutMe(column.optString("text"));
                            break;
                        case "color":
                            trainee.setPlaceOfResidence(column.optString("text"));
                            break;
                        case "status3":
                                trainee.setCollege(column.optString("text"));

                            break;
                        case "status35":
                                trainee.setFavoriteOfWorkplace(column.optString("text"));

                            break;
                        case "status8":
                                trainee.setMajor(column.optString("text"));
                            break;
                        case "status4":
                            if (column.has("text")) {
                                trainee.setCareerPath(column.optString("text"));

                            }
                            break;
                        case "status9":
                                trainee.setHowToWork(column.optString("text"));

                            break;
                        case "status98":
                                trainee.setEnglishLevel(column.optString("text"));
                            break;
                        case "status5":
                                trainee.setSearchingFor(column.optString("text"));

                            break;
                        case "numbers":
                            trainee.setPhoneNumber(value.replace("\"", ""));
                            break;
                        case "status":
                                trainee.setAreYouPassedIewaCamp(column.optString("text"));
                            break;
                        case "file":
                            if (value != null && !value.equals("null")) {
                                JSONObject fileObj = new JSONObject(value);
                                if (fileObj.has("files")) {
                                    JSONArray filesArray = fileObj.getJSONArray("files");
                                    if (filesArray.length() > 0) {
                                        JSONObject firstFile = filesArray.getJSONObject(0);
                                        if (firstFile.has("assetId")) {
                                            String assetId = firstFile.getString("assetId");
                                            log.info("Asset ID: " + assetId);
                                            trainee.setCv(assetId);
                                        }
                                    }
                                }
                            }
                            break;
                    }
                }

                traineeRepository.save(trainee);
            }

            return null;
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return null;
        }
    }



    public void updateInterviewsFromMonday() {
        try {
            List<Interview> interviews = (List<Interview>) interviewRepository.findAll();
            for (int i = 0; i < interviews.size(); i++) {
                Interview interview = interviews.get(i);
                String query = String.format("query { items (ids: [%s]) { column_values { id value ... on StatusValue { text } ... on DropdownValue { text } } } }", interview.getInterviewMondayId());
                String url = "https://api.monday.com/v2";
                RestTemplate restTemplate = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Authorization", this.mondayConfig.getToken());
                Map<String, Object> body = new HashMap<>();
                body.put("query", query);
                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
                String response = restTemplate.postForObject(url, request, String.class);
                JSONObject responseData = new JSONObject(response);
                JSONArray columnValues = responseData.getJSONObject("data").getJSONArray("items").getJSONObject(0).getJSONArray("column_values");
                for (int j = 0; j < columnValues.length(); j++) {
                    JSONObject column = columnValues.getJSONObject(j);
                    String id = column.getString("id");
                    String value = column.optString("value", null);


//                    log.info("Hour: " + column);
                    switch (id) {
                        case "status":
                            interview.setStatus(Interview.Status.fromString(column.optString("text")));
                            break;
                        case "dup__of_status":
                            interview.setAcceptionStatus(Interview.AcceptionStatus.fromString(column.optString("text")));
                            break;
                        case "date_1":
                            if (value != null && !value.equals("null")) {
                                JSONObject dateObj = new JSONObject(value);
                                log.info("Date: " + dateObj);
                                if (dateObj.has("date")) {
                                    String dateValue = dateObj.getString("date");
                                    log.info("Date: " + dateValue);
                                    interview.setInterviewDate(dateValue);
                                }
                            }
                            break;
                        case "hour":
                            if (value != null && !value.equals("null")) {
                                JSONObject hourObj = new JSONObject(value);
                                String hour = hourObj.optString("hour");
                                if (hourObj.has("hour")) {
                                    interview.setInterviewTime(hour);
                                }
                            }
                            break;

                    }
                }
                interviewRepository.save(interview);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }


    public String upload(MultipartFile file, String itemId) {
        try {
            log.info("itemId: " + itemId);
            log.info("File: " + file);
            String url = "https://api.monday.com/v2/file";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.set("Authorization", this.mondayConfig.getToken());

            // Prepare body
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("query", "mutation ($file: File!) { add_file_to_column (item_id: " + itemId + ", column_id: \"file\", file: $file) { id } }"); // Corrected mutation

            // Convert file to a resource
            Resource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
            body.add("variables[file]", resource); // Corrected file handling

            // Send request
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
            log.info(response);
            return "File uploaded successfully";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

















}
