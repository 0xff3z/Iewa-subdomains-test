package iewa.api.Service.BusinessOwner;

import iewa.api.Config.ApiResponseDTO;
import iewa.api.Model.BusinessOwner;
import iewa.api.Model.Invoice;
import iewa.api.Repository.BusinessOwnerRepository;
import iewa.api.Service.Monday;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class InvoiceService {

    private static final Logger log = LoggerFactory.getLogger(InvoiceService.class);
    @Autowired
    private Monday monday;


    @Autowired
    private RabbitTemplate rabbitTemplate;


    @Autowired
    private BusinessOwnerRepository businessOwnerRepository;
    @Transactional
    public ResponseEntity<?> getInvoices(String email) {
        try {
            BusinessOwner businessOwner = this.businessOwnerRepository.findByEmail(email);
            this.monday.getInvoices(businessOwner.getMondayId());
            this.rabbitTemplate.convertAndSend("sync_invoice", "routing_key", businessOwner.getMondayId());
            ArrayList<Invoice> invoices = businessOwner.getInvoices();
            return ResponseEntity.ok(new ApiResponseDTO<>(true,"Success", invoices,200));
        }
        catch (Exception e) {
            log.error("Error", e);
            return ResponseEntity.badRequest().body("Error");
        }
    }


    public ResponseEntity<?> downloadInvoice(String invoiceId) {
        try {
            String url = this.monday.generateAssetUrl(invoiceId);
            return ResponseEntity.ok(new ApiResponseDTO<>(true,"Success", url,200));
        } catch (Exception e) {
            log.error("Error", e);
            return ResponseEntity.badRequest().body("Error");
        }
    }

}
