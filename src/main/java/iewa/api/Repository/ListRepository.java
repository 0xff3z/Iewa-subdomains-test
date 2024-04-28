package iewa.api.Repository;

import iewa.api.Model.UserList;
import org.springframework.data.repository.CrudRepository;

public interface ListRepository extends CrudRepository<UserList, Long> {

    Boolean existsByCandidateMondayIdAndBusinessOwnerMondayId(String candidateMondayId, String businessOwnerMondayId);

    UserList findByCandidateMondayIdAndBusinessOwnerMondayId(String candidateMondayId, String businessOwnerMondayId);


}

