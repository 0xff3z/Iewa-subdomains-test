import {Body, Controller, Delete, Get, Post, Res, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {ApiTags} from "@nestjs/swagger";
import {ListService} from "../Service/List.service";
import {CurrentAuthClientUser} from "../Config/CurrentAuthClientUser.decorator";


@UseGuards(AuthGuard('jwt'))

@Controller('list')
@ApiTags('List')
export class ListController {
    constructor(
        private readonly listService: ListService
    ) {
    }



    @Get("get")
    async getMyLists(
        @CurrentAuthClientUser() user,
        @Res() res
    )
    {
       try {
              return this.listService.getMyLists(res, user);
       }
         catch (e) {
              console.log(e);
         }
    }


    @Get("get/iewa")
    async getIewaLists(
        @CurrentAuthClientUser() user,
        @Res() res
    )
    {
       try {
              return this.listService.getIewaLists(res, user);
       }
         catch (e) {
              console.log(e);
         }
    }


    @Post("/add")
    async addList(
        @CurrentAuthClientUser() user,
        @Res() res,
        @Body() body: any
    )
    {
        try {
            return this.listService.addList(res, user, body);
        }
        catch (e) {
            console.log(e);
        }
    }


    @Post("/delete")
    async deleteList(
        @CurrentAuthClientUser() user,
        @Res() res,
        @Body() body: any
    )
    {
        try {
            return this.listService.deleteList(res, user, body);
        }
        catch (e) {
            console.log(e);
        }
    }

}