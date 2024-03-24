import {Controller, Get, OnModuleInit, Req, Res} from '@nestjs/common';
import {AvailableJobService} from "../Service/available-job.service";

@Controller('available-job')
export class AvailableJobController implements OnModuleInit{
    constructor(
        private readonly AvailableJobService: AvailableJobService,
    ) {}

    onModuleInit(): any {
        return this.AvailableJobService.createAllJobs()
    }


    @Get("get")
    async get(@Res() res, @Req() req) {
        try {
            const allJobs = await this.AvailableJobService.findAll()
            return res.json({
                status: 200,
                data: {
                    allJobs: allJobs
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}
