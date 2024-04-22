import {Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards} from '@nestjs/common';
import { MondayService } from 'src/Service/monday.service';
import { AuthService } from '../Service/Auth/auth.service';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CurrentAuthClientUser} from "../Config/CurrentAuthClientUser.decorator";
import {BusinessOwner} from "../Models/BusinessOwner";
import {AuthGuard} from "@nestjs/passport";
import {RequestsService} from "../Service/requests.service";

@Controller('requests-list')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Requests')
export class RequestsController {
    constructor(
        private readonly requestsService: RequestsService
    ) { }


    @Get("get")
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Get requests list' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiOperation({ summary: 'Get requests list' })
    async get(

        @CurrentAuthClientUser() businessOwner:BusinessOwner,
        @Res() res
    ) {
        try {
            return this.requestsService.getRequests(businessOwner,res)
        }
        catch (error) {
            console.log(error)
            return res.json({status: 500, data: error})
        }
    }

    @Post("add")
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Request new Candidate' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiOperation({ summary: 'Request new Candidate' })
    async add(

        @Res() res,
        @Body() body,
        @CurrentAuthClientUser() businessOwner:BusinessOwner


    ) {
        try {
            return this.requestsService.addRequest(body, businessOwner,res)
            // const token = req.headers.authorization.split(" ")[1];
            // const client = await this.AuthService.findClient(token)
            // const phoneWithoutPlus = client.phone.replace(/^\+/, '');
            // const monday = await this.mondayService.create_item("1392725521", "topics", {
            //     "job_title0": body.job_title,
            //     "skills": body.skills,
            //     "numbers_of_employee": 1,
            //     "job_level": body.experienceLevel,
            //     "long_text7": body.jobResponsibilities,
            //     "long_text9": body.jobRequirementsExperinces,
            //     "long_text1": body.requiredSkillsDetails,
            //     "working_days": body.workingDays,
            //     "when_": body.whenToStart,
            //     "employment_type6": body.jobType,
            //     "english": body.englishLevel,
            //     "salary_cap": body.maxSalary,
            //     "comment": body.additionalNotes,
            //
            // }, client.company_name);
            // const insertInConnctedBoards = this.mondayService.insertInConnctedBoards(monday, 1392725521, "phone", `${phoneWithoutPlus}`, "connect_boards", res, client.mondayId);



        }
        catch (error) {
            console.log(error)
            return res.json({status: 500, data: error})
        }
    }

    @Post("reject")
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Reject request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiOperation({ summary: 'Reject request' })
    async reject(

        @Res() res,
        @Body() body,
        @CurrentAuthClientUser() businessOwner:BusinessOwner,

    ) {
        try {
            return this.requestsService.rejectRequest(body, businessOwner,res)
        }
        catch (error) {
            console.log(error)
            return res.json({status: 500, data: error})
        }
    }


}
