package iewa.api.Repository;

import iewa.api.Model.Invoice;
import iewa.api.Model.Trainee;
import org.springframework.data.repository.CrudRepository;

public interface TraineeRepository extends CrudRepository<Trainee, Long> {


    Trainee findByMondayId(String mondayId);



}

