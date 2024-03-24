import {Injectable} from "@nestjs/common";
import {Invoice} from "../Models/Invoice";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {EventEmitter2} from "@nestjs/event-emitter";

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice) private invoiceRepository: Repository<Invoice>,
        private eventEmitter: EventEmitter2

    ) {
    }

    async createAllInvoices(object, businessOwner) {
        try {
            for (const item of object) {
                const exiest = await this.invoiceRepository.findOne({ where: { invoiceId: item.id } });
                if (!exiest) {
                    const filesObject = item.column_values.find((column) => column.id === "files");
                    const files = filesObject ? JSON.parse(filesObject.value).files : null;
                    const invoice = await this.invoiceRepository.create({
                        invoiceId: parseInt(item.column_values.find((column) => column.id === "text").value.replace(/"/g, ''), 10), // Parse and convert to integer
                        invoiceType: item.column_values.find((column) => column.id === "status_1").text,
                        invoiceStatus: item.column_values.find((column) => column.id === "status1").text,
                        invoiceTotal: parseInt(item.column_values.find((column) => column.id === "numbers5").value.replace(/"/g, ''), 10),
                        invoiceAssetUrl: files ? files[0].assetId : null,
                        invoiceDate: item.column_values.find((column) => column.id === "date4").date,
                        businessOwner: businessOwner
                    });
                    await this.invoiceRepository.save(invoice);
                } else {
                    const filesObject = item.column_values.find((column) => column.id === "files");

                    const files = filesObject ? JSON.parse(filesObject.value).files : null;
                    await this.invoiceRepository.update({invoiceId: item.id}, {
                        invoiceType: item.column_values.find((column) => column.id === "status_1").text,
                        invoiceStatus: item.column_values.find((column) => column.id === "status1").text,
                        invoiceTotal: parseInt(item.column_values.find((column) => column.id === "numbers5").value.replace(/"/g, ''), 10),
                        invoiceAssetUrl: files ? files[0].assetId : null,
                        invoiceDate: item.column_values.find((column) => column.id === "date4").date,
                        businessOwner: businessOwner
                    });
                }
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getMyInvoices(res, businessOwner) {
        try {
            this.eventEmitter.emit("getMyInvoices",{
                boardId: 1399424616,
                itemId: businessOwner.mondayId,
                userId: businessOwner.id
            })
            const invoices = await this.invoiceRepository.find({ where: { businessOwner: businessOwner } });
            return res.status(200).json({status: 200, message: 'Invoices retrieved successfully', data: invoices});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: 'Internal server error'});
        }
    }


}