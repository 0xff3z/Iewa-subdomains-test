import {Controller, Get, HttpCode, Res, UseGuards} from "@nestjs/common";
import {ApiOkResponse, ApiOperation, ApiProperty, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {InvoiceService} from "../Service/invoice.service";
import {CurrentAuthClientUser} from "../Config/CurrentAuthClientUser.decorator";
import {BusinessOwner} from "../Models/BusinessOwner";

@Controller('invoice')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {
    }

    @ApiOperation({summary: 'Get Business Owner Invoices'})
    @ApiOkResponse({description: 'Business Owner Invoices Retrieved Successfully'})
    @ApiProperty({type: 'Invoice'})
    @HttpCode(200)
    @Get("my-invoices")
    async getMyInvoices(
        @CurrentAuthClientUser() businessOwner: BusinessOwner,
        @Res() res
    ) {
        return this.invoiceService.getMyInvoices(res, businessOwner);
    }
}
