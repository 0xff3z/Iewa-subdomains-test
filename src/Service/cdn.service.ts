import {Injectable} from "@nestjs/common";
import {MondayService} from "./monday.service";

@Injectable()
export class CdnService {
    constructor(
        private readonly MondayService: MondayService
    ) {
    }


    async generateMondayAssetUrl(res, businessOwner, id) {
        try {
            const assetUrl = await this.MondayService.GenerateAssetURl(id);
            return res.status(200).json({status: 200, message: 'Asset Url Generated Successfully', data: assetUrl});
        }
        catch (e) {
            console.log(e);
            res.status(500).json({message: 'Internal server error'});
        }
    }

}