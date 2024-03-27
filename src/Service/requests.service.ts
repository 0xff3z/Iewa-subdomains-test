import {Injectable} from "@nestjs/common";
import {EventEmitter2} from "@nestjs/event-emitter";
import {CandidateRequest} from "../Models/CandidateRequest.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class RequestsService {
    constructor(
        private eventEmitter: EventEmitter2,
        @InjectRepository(CandidateRequest) private candidateRequestRepository: Repository<CandidateRequest>

    ) {
    }

    async addRequest(body, businessOwner,res) {
        try {
            this.eventEmitter.emit("monday-create-item", {
                boardId: "1392725521",
                groupId: "topics",
                itemName: businessOwner.company_name,
                form:{
                    "job_title0": body.job_title,
                    "skills": body.skills,
                    "numbers_of_employee": 1,
                    "job_level": body.experienceLevel,
                    "long_text7": body.jobResponsibilities,
                    "long_text9": body.jobRequirementsExperinces,
                    "long_text1": body.requiredSkillsDetails,
                    "working_days": body.workHours,
                    "when_": body.whenToStart,
                    "employment_type": body.contractType,
                    "employment_type6": body.jobType,
                    "english": body.englishLevel,
                    "salary_cap": body.maxSalary,
                    "comment": body.additionalNotes,
                    "connect_boards6": {
                        "item_ids": [businessOwner.mondayId]
                    },

                }

            })
            return res.status(200).json({status: 200, data: "Request added successfully"})
        }
        catch (error) {
            console.log(error)
            return {status: 500, data: error}
        }
    }
    async getRequests(businessOwner,res) {
        try {
            this.eventEmitter.emit("getMyRequests", {
                itemId: businessOwner.mondayId
            })
            const requests = await this.candidateRequestRepository.find({where: {businessOwner: businessOwner}})
            return res.status(200).json({status: 200, data: requests, message: "Requests retrieved successfully"})
        }
        catch (error) {
            console.log(error)
            return {status: 500, data: error}
        }
    }
    async createAllRequests(object, businessOwner) {
        try {
            for (const item of object) {
                const existing = await this.candidateRequestRepository.findOne({ where: { mondayId: item.id } });
                if (!existing) {
                    const additionalNotes = (item.column_values && item.column_values.find(column => column.id === "comment"))?.text || "";
                    const technicalSkills = (item.column_values && item.column_values.find(column => column.id === "skills"))?.text || "";
                    const experienceLevel = (item.column_values && item.column_values.find(column => column.id === "job_level"))?.text || "";
                    const numberOfEmployeesValue = (item.column_values && item.column_values.find(column => column.id === "numbers_of_employee")?.value) || "";
                    const numberOfEmployees = isNaN(parseInt(numberOfEmployeesValue)) ? 0 : parseInt(numberOfEmployeesValue);
                    const jobResponsibilities = (item.column_values && item.column_values.find(column => column.id === "long_text7"))?.value || "";
                    const jobRequirementsExperiences = (item.column_values && item.column_values.find(column => column.id === "long_text9"))?.value || "";
                    const requiredSkillsDetails = (item.column_values && item.column_values.find(column => column.id === "long_text1"))?.value || "";
                    const jobTitle = (item.column_values && item.column_values.find(column => column.id === "job_title0"))?.text || "";
                    const skills = technicalSkills;
                    const jobLevel = experienceLevel;
                    const workingDays = (item.column_values && item.column_values.find(column => column.id === "working_days"))?.text || "";
                    const whenToStart = (item.column_values && item.column_values.find(column => column.id === "when_"))?.text || "";
                    const contractType = (item.column_values && item.column_values.find(column => column.id === "employment_type"))?.text || "";

                    const employmentType = (item.column_values && item.column_values.find(column => column.id === "employment_type6"))?.text || "";

                    const english = (item.column_values && item.column_values.find(column => column.id === "english"))?.text || "";
                    const salaryCap = (item.column_values && item.column_values.find(column => column.id === "salary_cap"))?.value || "";

                    const candidateRequest = await this.candidateRequestRepository.create({
                        additionalNotes,
                        technicalSkills: JSON.parse(technicalSkills || "{}"),
                        experienceLevel,
                        numberOfEmployees: numberOfEmployees,
                        jobResponsibilities: JSON.parse(jobResponsibilities || "{}"),
                        jobRequirementsExperiences: JSON.parse(jobRequirementsExperiences || "{}"),
                        jobTitle,
                        skills: [technicalSkills],
                        workingDays,
                        whenToStart,
                        employmentType,
                        englishLevel: english,
                        salaryCap: salaryCap,
                        businessOwner:businessOwner,
                        mondayId: item.id,
                        contractType:contractType
                    });

                    await this.candidateRequestRepository.save(candidateRequest);
                } else {
                    existing.additionalNotes = (item.column_values && item.column_values.find(column => column.id === "comment"))?.text || "";
                    existing.technicalSkills = (item.column_values && item.column_values.find(column => column.id === "skills"))?.text || "";
                    existing.experienceLevel = (item.column_values && item.column_values.find(column => column.id === "job_level"))?.text || "";
                    existing.numberOfEmployees = (item.column_values && item.column_values.find(column => column.id === "numbers_of_employee")?.value) || "";
                    existing.jobResponsibilities = (item.column_values && item.column_values.find(column => column.id === "long_text7"))?.value || "";
                    existing.jobRequirementsExperiences = (item.column_values && item.column_values.find(column => column.id === "long_text9"))?.value || "";
                    existing.jobTitle = (item.column_values && item.column_values.find(column => column.id === "job_title0"))?.text || "";
                    existing.skills = (item.column_values && item.column_values.find(column => column.id === "skills"))?.text || "";
                    existing.workingDays = (item.column_values && item.column_values.find(column => column.id === "working_days"))?.text || "";
                    existing.whenToStart = (item.column_values && item.column_values.find(column => column.id === "when_"))?.text || "";
                    existing.employmentType = (item.column_values && item.column_values.find(column => column.id === "employment_type"))?.text || "";
                    existing.englishLevel = (item.column_values && item.column_values.find(column => column.id === "english"))?.text || "";
                    existing.salaryCap = (item.column_values && item.column_values.find(column => column.id === "salary_cap"))?.value || "";

                    // await this.candidateRequestRepository.save(existing);

                }

            }
        } catch (error) {
            console.log(error);
            return { status: 500, data: error };
        }
    }




}