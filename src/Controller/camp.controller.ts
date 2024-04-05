import {Body, Controller, Get, Post, Res} from "@nestjs/common";
import {ApiOkResponse, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {CampService} from "../Service/camp.service";
import {RegisterCampDTO} from "../DTO/RegisterCampDTO";

@Controller('camp')
export class CampController {


    constructor(
      private readonly campService: CampService
    ) {
    }


    @ApiOkResponse({description: 'Get Form Steps'})
    @ApiOperation({summary: 'Get Form Steps'})
    @ApiResponse({status: 200, description: 'Form Steps retrieved successfully'})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @Get('form-steps')
    async getFormSteps(
        @Res() res: any
    ) {
        try {
            return this.campService.getFormSteps(res)
        }
        catch (e) {
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }


    @Post('register')
    @ApiOkResponse({description: 'Register Candidate for Camp'})
    @ApiOperation({summary: 'Register Candidate for Camp'})
    @ApiResponse({status: 201, description: 'Candidate registered successfully'})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @Post('register')
    async registerCamp(
        @Res() res: any, @Body() body: RegisterCampDTO
    ) {
        try {
            return this.campService.registerCamp(res, body)
        }
        catch (e) {
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }
}