import {Body, Controller, Delete, Get, Param, Post, Res, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {MarketplaceService} from "../Service/marketplace.service";
import {ApiOkResponse, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {Candidate} from "../Models/Candidate.entity";
import {CurrentAuthClientUser} from "../Config/CurrentAuthClientUser.decorator";
import {AddToListDTO} from "../DTO/AddToListDTO";
@UseGuards(AuthGuard('jwt'))

@Controller('marketplace')
@ApiTags('Marketplace')
export class MarketplaceController  {
    constructor(
        private readonly marketplaceService: MarketplaceService
    ) { }


    @Get("get")
    @ApiOkResponse({description: 'Marketplace retrieved successfully', isArray: true, status: 200,type: Candidate})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    async getMarketplace(@Res() res): Promise<any>{
        return this.marketplaceService.getMarketplace(res);
    }

    @Post('add-my-list')
    @ApiOkResponse({description: 'The Candidate is Added Successfully ', isArray: false, status: 200,type: Candidate})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @UsePipes(ValidationPipe)
    async addMyList(
        @Res() res,
        @CurrentAuthClientUser() user,
        @Body() body: AddToListDTO

    ): Promise<any>{
        return this.marketplaceService.addMyList(res, user, body);
    }

    @Delete('remove-my-list')
    @ApiOkResponse({description: 'The Candidate is Removed Successfully ', isArray: false, status: 200,type: Candidate})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @UsePipes(ValidationPipe)
    async removeMyList(
        @Res() res,
        @CurrentAuthClientUser() user,
        @Body() id: AddToListDTO

    ): Promise<any>{
        return this.marketplaceService.removeMyList(res, user, id);
    }

    @Get('my-list')
    @ApiOkResponse({description: 'My List retrieved successfully', isArray: true, status: 200,type: Candidate})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    async getMyList(@Res() res, @CurrentAuthClientUser() user): Promise<any>{
        return this.marketplaceService.getMyList(res, user);
    }

    @Get("get-candidate-experience/:id")
    @ApiOkResponse({description: 'Candidate experience retrieved successfully', isArray: true, status: 200})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    async getCandidateExperience(@Res() res,  @Param("id") id): Promise<any>{
        console.log(id);
        return this.marketplaceService.getCandidateExperience(res,  id);
    }


}
