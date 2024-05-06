package iewa.api.Config;


import iewa.api.Service.Dataload;
import iewa.api.Service.Monday;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;

@Component
public class DataLoader implements CommandLineRunner {


    @Autowired
    private Monday monday;

    @Autowired
    private Dataload dataload;

    @Override
    public void run(String... args) throws Exception {
        this.monday.createCandidates();
        this.monday.getAllTrainees();
//        this.dataload.createListForUsersFromCSV();
        this.monday.createLandingPageCandidates();


    }


}