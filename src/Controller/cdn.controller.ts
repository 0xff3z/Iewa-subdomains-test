import {Controller, Param, Post, Res, UseGuards} from "@nestjs/common";
import {ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CdnService} from "../Service/cdn.service";
import {AuthGuard} from "@nestjs/passport";
import {CurrentAuthClientUser} from "../Config/CurrentAuthClientUser.decorator";

@Controller('cdn')
@ApiTags('CDN')
@UseGuards(AuthGuard('jwt'))
export class CdnController {
    constructor(private readonly cdnService: CdnService) {
    }


    @ApiProperty({type: 'CDN'})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @ApiOperation({summary: 'Generate Monday Asset Url'})
    @ApiParam({name: 'id', type: 'string', required: true})
    @Post("generate-asset-url/:id")
    async generateMondayAssetUrl(
        @Res() res,
        @CurrentAuthClientUser() businessOwner,
        @Param('id') id: string
    ) {
        return this.cdnService.generateMondayAssetUrl(res, businessOwner, id);
    }

    @ApiProperty({type: 'CDN'})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 500, description: 'Internal server error'})
    @ApiOperation({summary: 'Download Invoice'})
    @Post("download-invoice/:id")
    async downloadInvoice(
        @Res() res,
        @CurrentAuthClientUser() businessOwner,
        @Param('id') id: string
    ) {
        return this.cdnService.downloadInvoice(res, businessOwner,id);
    }

}