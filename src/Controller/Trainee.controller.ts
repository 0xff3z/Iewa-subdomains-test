import {
    Body,
    Controller,
    Get,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {TraineeService} from "../Service/trainee.service";
import {ApiOkResponse, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";


@Controller('trainee')
export class TraineeController {
  constructor(private readonly traineeService: TraineeService) {}



    @ApiOkResponse({description: 'Register a new trainee'})
    @ApiOperation({summary: 'Register a new trainee'})
    @ApiResponse({status: 201, description: 'Trainee registered successfully'})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    // @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('upload'))
    @Post('register')
    async registerTrainee(
        @Res() res: any, @Body() body: any,
                          @UploadedFile() file: Express.Multer.File
                          ){
        try {
            return this.traineeService.registerTrainee(res, body,file)
        }
        catch (e) {
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }


    @ApiOkResponse({description: 'Get all trainees'})
    @ApiOperation({summary: 'Get all trainees'})
    @ApiResponse({status: 200, description: 'Trainees retrieved successfully'})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @Get('get')
    async getAllTrainees(@Res() res: any){
        try {
            return this.traineeService.getAllTrainees(res)
        }
        catch (e) {
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }

}
