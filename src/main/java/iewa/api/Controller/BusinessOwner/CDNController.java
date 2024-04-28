package iewa.api.Controller.BusinessOwner;


import iewa.api.Config.ApiResponseDTO;
import iewa.api.Service.Monday;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;

@RestController
@RequestMapping("/business-owner/cdn")
public class CDNController {


    private static final Logger log = LoggerFactory.getLogger(CDNController.class);
    @Autowired
    private Monday monday;

    @PostMapping("/download/cv/{id}")
    public ResponseEntity<?> generateMondayAssetUrl(@PathVariable String id) {
        try {
            String assetUrl = monday.generateAssetUrl(id); // Replace with actual service call
            return ResponseEntity.ok(new ApiResponseDTO<>(true,"Asset URL generated successfully",assetUrl,200));
        } catch (Exception e) {
            log.error("Error while generating asset URL", e);
            return ResponseEntity.badRequest().body("Error while generating asset URL");
        }
    }

}
