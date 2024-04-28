package iewa.api.Repository;

import iewa.api.Model.BusinessOwner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessOwnerRepository extends JpaRepository<BusinessOwner, Long> {

    BusinessOwner findByEmail(String email);

    BusinessOwner findByMondayId(String mondayId);


}

