package iewa.api.Repository;

import iewa.api.Model.LandingPageCandidate;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LandingPageCandidateRepository extends CrudRepository<LandingPageCandidate,Long> {
    LandingPageCandidate findByMondayId(String mondayId);
    LandingPageCandidate findById(long id);

}
