package iewa.api.Config;

import iewa.api.Model.BusinessOwner;
import iewa.api.Model.Candidate;
import iewa.api.Model.User;
import iewa.api.Model.UserList;
import iewa.api.Repository.BusinessOwnerRepository;
import iewa.api.Repository.CandidateRepository;
import iewa.api.Repository.ListRepository;
import iewa.api.Service.Monday;
import jakarta.transaction.Transactional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;


@Component
public class RabbitMQListener {


    @Autowired
    private BusinessOwnerRepository businessOwnerRepository;

    @Autowired
    private ListRepository listRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private Monday monday;

    @Autowired
    private AmqpAdmin amqpAdmin;


    @RabbitListener(queues = "sync_monday")
    @Transactional
    public void receiveMessage(String id) {
        try {
            System.out.println("Received <" + id + ">");
            BusinessOwner businessOwner = this.businessOwnerRepository.findByMondayId(id);
            ArrayList<Integer> shortList = businessOwner.getShortListIds();
            ArrayList<Integer> myList = businessOwner.getMyListIds();
            ArrayList<Integer> acceptedList = businessOwner.getAcceptedListIds();
            ArrayList<Integer> rejectedList = businessOwner.getRejectedListIds();
            ArrayList<Integer> iewaList = businessOwner.getIewaListIds();



            String queueName = "queue." + id;
            Queue queue = new Queue(queueName, true, false, false);
            amqpAdmin.declareQueue(queue);
            Binding binding = BindingBuilder.bind(queue).to(new DirectExchange("sync_monday")).with("routing_key");
            amqpAdmin.declareBinding(binding);
            String changed_id =  this.monday.SyncListItems(businessOwner.getMondayId(), shortList, myList, acceptedList, rejectedList, iewaList);



        }
        catch (Exception e){
        }
    }

    @RabbitListener(queues = "sync_monday_iewa_list")
    @Transactional
        public void receiveMessageIewaList(String id) {
        try {

            System.out.println("Received <" + id + ">");
            String queueName = "queue." + id + "iewa_list";
            Queue queue = new Queue(queueName, true, false, false);
            amqpAdmin.declareQueue(queue);
            Binding binding = BindingBuilder.bind(queue).to(new DirectExchange("sync_monday_iewa_list")).with("routing_key");
            amqpAdmin.declareBinding(binding);
            ArrayList<Integer> iewaList =  this.monday.getIewaList(id);
            BusinessOwner businessOwner = this.businessOwnerRepository.findByMondayId(id);


            iewaList.forEach((candidate_id) -> {
                Candidate candidate = this.candidateRepository.findByMondayId(candidate_id.toString());
                Boolean existingList = this.listRepository.existsByCandidateMondayIdAndBusinessOwnerMondayId(candidate_id.toString(), businessOwner.getMondayId());
                if (existingList){
                    return;
                }
                UserList list = new UserList();
                list.setBusinessOwner(businessOwner);
                list.setCandidateMondayId(candidate_id.toString());
                list.setBusinessOwnerMondayId(businessOwner.getMondayId());
                list.setCandidate(candidate);
                list.setType(UserList.Type.IEWA_LIST);
                this.listRepository.save(list);
            });






        }
        catch (Exception e){
        }
    }


    @RabbitListener(queues = "sync_invoice")
    @Transactional
    public void receiveMessageInvoice(String id) {
        try {
            String queueName = "queue." + id + "invoice";
            Queue queue = new Queue(queueName, true, false, false);
            amqpAdmin.declareQueue(queue);
            Binding binding = BindingBuilder.bind(queue).to(new DirectExchange("sync_invoice")).with("routing_key");
            amqpAdmin.declareBinding(binding);
            BusinessOwner businessOwner = this.businessOwnerRepository.findByMondayId(id);
            this.monday.getInvoices(businessOwner.getMondayId());

        } catch (Exception e) {
        }
    }

    @RabbitListener(queues = "sync_item_update")
    @Transactional
    public void receiveMessageItemUpdate(JSONObject object) {
        try {

            String queueName = "queue." + object.getString("id") + "item_update";
            Queue queue = new Queue(queueName, true, false, false);
            amqpAdmin.declareQueue(queue);
            Binding binding = BindingBuilder.bind(queue).to(new DirectExchange("sync_item_update")).with("routing_key");
            amqpAdmin.declareBinding(binding);
            UserList.Type type = UserList.Type.valueOf(object.getString("type"));
            this.monday.createItemUpdate(object.getString("id"), type, object.getString("companyName"), object.getString("reason"));

        } catch (Exception e) {

        }
    }

}