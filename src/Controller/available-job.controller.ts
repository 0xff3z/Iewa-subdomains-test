import {Controller, Get, OnModuleInit, Req, Res} from '@nestjs/common';
import {AvailableJobService} from "../Service/available-job.service";

@Controller('available-job')
export class AvailableJobController{
    constructor(
        private readonly AvailableJobService: AvailableJobService,
    ) {}




    @Get("get")
    async get(@Res() res, @Req() req) {
        try {
            await this.AvailableJobService.createAllJobs()
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
