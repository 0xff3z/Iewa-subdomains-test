package iewa.api.Controller.BusinessOwner;


import iewa.api.Service.BusinessOwner.InvoiceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/business-owner/invoice")
@RestController
public class InvoiceController {

    private static final Logger log = LoggerFactory.getLogger(InvoiceController.class);
    @Autowired
    private InvoiceService invoiceService;


    @GetMapping("/get")
    public ResponseEntity<?> getInvoices(@AuthenticationPrincipal String email) {
        try {
            return this.invoiceService.getInvoices(email);
        } catch (Exception e) {
            log.error("Error", e);
            return ResponseEntity.badRequest().body("Error");
        }
    }


    @PostMapping("download/{invoiceId}")
    public ResponseEntity<?> downloadInvoice(
            @AuthenticationPrincipal String email,
            @PathVariable  String invoiceId
    ) {
        try {
            log.info("Downloading invoice" + invoiceId);

            return this.invoiceService.downloadInvoice(invoiceId);
        } catch (Exception e) {
            log.error("Error", e);
            return ResponseEntity.badRequest().body("Error");
        }
    }

}
