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
            console.log(object);
            for (const item of object) {
                const exiest = await this.invoiceRepository.findOne({ where: { mondayId: item.id } });
                if (!exiest) {
                    const filesObject = item.column_values.find((column) => column.id === "files");
                    const files = filesObject && filesObject.value ? JSON.parse(filesObject.value).files : null;
                    console.log(item.column_values.find((column) => column.id === "text").value);
                    const invoice = await this.invoiceRepository.create({
                        invoiceId: item.column_values.find((column) => column.id === "text") ?item.column_values.find((column) => column.id === "text").value : null,
                        invoiceType: item.column_values.find((column) => column.id === "status_1") ? item.column_values.find((column) => column.id === "status_1").text : null,
                        invoiceStatus: item.column_values.find((column) => column.id === "status1") ? item.column_values.find((column) => column.id === "status1").text : null,
                        invoiceTotal: item.column_values.find((column) => column.id === "numbers5") ? parseInt(item.column_values.find((column) => column.id === "numbers5").value.replace(/"/g, ''), 10) : null,
                        invoiceAssetUrl: files && files[0] ? files[0].assetId : null,
                        invoiceDate: item.column_values.find((column) => column.id === "date4") ? item.column_values.find((column) => column.id === "date4").date : null,
                        businessOwner: businessOwner,
                        mondayId: item.id
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
                        businessOwner: businessOwner,
                        mondayId: item.id
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