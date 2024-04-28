package iewa.api.Repository;

import iewa.api.Model.BusinessOwner;
import iewa.api.Model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    Candidate findByMondayId(String mondayId);


}

