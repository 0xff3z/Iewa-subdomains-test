import { Injectable } from '@nestjs/common';
import {AvailableJob} from "../Models/AvailableJob";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Candidate} from "../Models/Candidate.entity";

@Injectable()
export class AvailableJobService {
    constructor(
        @InjectRepository(AvailableJob) private readonly availableJobRepository: Repository<AvailableJob>,
        @InjectRepository(Candidate) private readonly candidateRepo: Repository<Candidate>,
    ) {
    }


    async createAllJobs() {
        try {
            const candidate = await this.candidateRepo.find()
            for (const c of candidate) {
                const existingJob = await this.availableJobRepository.findOne({where: {title: c.job}})
                if (!existingJob) {
                    const newJob = await this.availableJobRepository.create({
                        title: c.job,
                    })
                    await this.availableJobRepository.save(newJob)
                }


            }
        }
        catch (error) {
            console.log(error)
        }
    }


    async findAll() {
        try {
            return await this.availableJobRepository.find()
        } catch (error) {
            console.log(error)
        }
    }
}
