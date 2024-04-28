package iewa.api.Repository;

import iewa.api.Model.Candidate;
import iewa.api.Model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface InterviewRepository extends CrudRepository<Interview, Long> {

    Interview findById(long id);





}

