import {Body, Controller, Get, Post, Res, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {ApiBody, ApiOkResponse, ApiResponse, ApiTags} from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import {BusinessOwner} from "../Models/BusinessOwner";
import {Repository} from "typeorm";
import {CurrentAuthClientUser} from "../Config/CurrentAuthClientUser.decorator";
import {MyListsService} from "../Service/myLists.service";

@UseGuards(AuthGuard('jwt'))

@Controller('business-owner')
@ApiTags('Business Owner')
export class BusinessOwnerController {
    constructor(
        private readonly myListsService: MyListsService
    ) {
    }


    @Get("my-lists")
    @ApiOkResponse({description: 'My Lists retrieved successfully', isArray: true, status: 200})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    async getMyLists(
        @Res() res,
        @CurrentAuthClientUser() user,
    )
    {
        return this.myListsService.getMyLists(res, user);
    }

    @Post("add-to-list")
    @ApiOkResponse({description: 'Candidate added to list successfully', status: 200})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @ApiResponse({status: 404, description: 'Not Found'})
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                list: { type: 'string' },
                candidateId: { type: 'number' },
            },
            required: ['list', 'candidateId'],
        },
    })
    async addToList(
        @Res() res,
        @CurrentAuthClientUser() user,
        @Body() body: { type: string, candidateId: number, interviewId: number,  presentBy:string}
    )
    {
        return this.myListsService.addToList(res, user, body);
    }


    @Post("remove-from-list")
    @ApiOkResponse({description: 'Candidate removed from list successfully', status: 200})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @ApiResponse({status: 404, description: 'Not Found'})
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                list: { type: 'string' },
                candidateId: { type: 'number' },
                reason: { type: 'string' },
            },
            required: ['list', 'candidateId'],
        },
    })
    async removeFromList(
        @Res() res,
        @CurrentAuthClientUser() user,
        @Body() body: { type: string, candidateId: number, reason: string,interviewId: number}
    )
    {
        return this.myListsService.removeFromList(res, user, body);
    }

    @Post("create-interview")
    @ApiOkResponse({description: 'Interview created successfully', status: 200})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @ApiResponse({status: 404, description: 'Not Found'})
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                candidateId: { type: 'number' },
                date: { type: 'string' },
                time: { type: 'string' },
            },
            required: ['candidateId', 'date', 'time'],
        },
    })
    async createInterview(
        @Res() res,
        @CurrentAuthClientUser() user,
        @Body() body: { candidateId: number, date: string, time: string }
    )
    {
        return this.myListsService.createInterview(res, user, body);
    }


    @Get("get-iewa-list")
    @ApiOkResponse({description: 'Iewa List retrieved successfully', status: 200})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @ApiResponse({status: 404, description: 'Not Found'})
    async getIewaList(
        @Res() res,
        @CurrentAuthClientUser() user,
    )
    {
        try {
            return this.myListsService.getIewaList(res, user);

        }
        catch (e) {
            console.log(e)
        }
    }


    @Post("update-interview")
    @ApiOkResponse({description: 'Interview updated successfully', status: 200})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @ApiResponse({status: 404, description: 'Not Found'})
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                interviewId: { type: 'number' },
                date: { type: 'string' },
                time: { type: 'string' },
            },
            required: ['interviewId', 'date', 'time'],
        },
    })
    async updateInterview(
        @Res() res,
        @CurrentAuthClientUser() user,
        @Body() body: { interviewId: number, date: string, time: string,candidateId: number}
    )
    {
        return this.myListsService.updateInterview(res, user, body);
    }

    @Post("request-candidate-info")
    @ApiOkResponse({description: 'Candidate info requested successfully', status: 200})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @ApiResponse({status: 404, description: 'Not Found'})
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                candidateId: { type: 'number' },
            },
            required: ['candidateId'],
        },
    })
    async requestCandidateInfo(
        @Res() res,
        @CurrentAuthClientUser() user,
        @Body() body
    )
    {
        return this.myListsService.requestCandidateInfo(res, user, body);
    }


}
