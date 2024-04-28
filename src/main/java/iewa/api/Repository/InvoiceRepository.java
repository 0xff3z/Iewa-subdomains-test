package iewa.api.Repository;

import iewa.api.Model.Interview;
import iewa.api.Model.Invoice;
import org.springframework.data.repository.CrudRepository;

public interface InvoiceRepository extends CrudRepository<Invoice, Long> {

    Invoice findById(long id);

    Invoice findByInvoiceMondayId(String invoiceMondayId);


}

