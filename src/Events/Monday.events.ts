import {EventEmitter2, OnEvent} from "@nestjs/event-emitter";
import mondaySdk from 'monday-sdk-js';
import {InjectRepository} from "@nestjs/typeorm";
import {Candidate} from "../Models/Candidate.entity";
import {Repository} from "typeorm";
import {MondayService} from "../Service/monday.service";
import {MarketplaceService} from "../Service/marketplace.service";
import {
    AddToListPayloadType,
    CreateInterviewPayloadType,
    CreateItemUpdatePayloadType,
    UpdateItemInMondayPayloadType
} from "../Types/Types";
import {BusinessOwner} from "../Models/BusinessOwner";
import {Cron, CronExpression} from "@nestjs/schedule";
import {Interview} from "../Models/Interview.entity";
import {Invoice} from "../Models/Invoice";
import {InvoiceService} from "../Service/invoice.service";
import {RequestsService} from "../Service/requests.service";
import {IewaList} from "../Models/IewaList.entity";


export default class MondayEvents {
    public readonly monday;

    constructor(
        private eventEmitter: EventEmitter2,
        @InjectRepository(Candidate) private candidateRepository: Repository<Candidate>,
        @InjectRepository(BusinessOwner) private businessOwnerRepository: Repository<BusinessOwner>,
        @InjectRepository(Interview) private interviewRepository: Repository<Interview>,
        @InjectRepository(Invoice) private invoicesRepository: Repository<Invoice>,
        @InjectRepository(IewaList) private iewaListRepository: Repository<IewaList>,
        private mondayService: MondayService,
        private marketplaceService: MarketplaceService,
        private invoiceService: InvoiceService,
        private requestsService: RequestsService
    ) {
        this.monday = mondaySdk();
        this.monday.setApiVersion('2023-10');
        this.monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI1NjI2ODAwNSwiYWFpIjoxMSwidWlkIjo0MzIxMDQyOSwiaWFkIjoiMjAyMy0wNS0xM1QxODowODoxNC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTY4OTUwMDAsInJnbiI6ImV1YzEifQ.gvAyLNijyDdaGYoDJTPltn-Po-OyWivKS4IC6Ijmnp8");
    }


    @OnEvent("monday-create-item")
    async handleMondayCreateItemEvent(payload: any) {
       try {
           const columnValuesString = JSON.stringify(payload.form).replace(/"/g, '\\"');
           const mutation = `mutation {
                create_item(
                  board_id: "${payload.boardId}",
                  group_id: "${payload.groupId}",
                  item_name: "${payload.itemName}",
                  column_values: "${columnValuesString}",
                ) { 
                  id 
                }
              }`;
           const res = await this.monday.api(mutation).then(res => res);
           console.log(res)
           if (!isNaN(res)) {
               return res
           }



       }
       catch (e) {
           console.log(e)
           return e
       }
    }
    @OnEvent("monday-create-item-register")
    async handleMondayCreateItemRegisterEvent(payload: any) {
        try {
            const businessOwner = await this.businessOwnerRepository.findOneOrFail({where: {id: payload.userId}});
            const query = `
            query {
                items_page_by_column_values (board_id: ${payload.boardId}, columns: [{column_id: "email", column_values: ["${payload.form.email}"]}]) {
                    items {
                        id
                    }
                }
            }
        `;

            const exists = await this.monday.api(query).then(res => res.data.items_page_by_column_values.items[0]);
            if(exists) {
                businessOwner.mondayId = exists.id;
                await this.businessOwnerRepository.save(businessOwner);
            } else {
                const columnValuesString = JSON.stringify(payload.form).replace(/"/g, '\\"');
                const mutation = `mutation {
                create_item(
                  board_id: "${payload.boardId}",
                  group_id: "${payload.groupId}",
                  item_name: "${payload.itemName}",
                  column_values: "${columnValuesString}",
                ) { 
                  id 
                }
              }`;
                const res = await this.monday.api(mutation).then(res => res.data.create_item.id);

                if (!isNaN(res)) {
                    businessOwner.mondayId = res;
                    await this.businessOwnerRepository.save(businessOwner);
                    return res
                }
            }





        }
        catch (e) {
            console.log(e)
            return e
        }
    }

    @OnEvent("monday-check-item")
    async handleMondayCheckItemEvent(payload: any) {
        try {
            const query = `
            query {
                items_page_by_column_values (board_id: ${payload.boardId}, columns: [{column_id: "${payload.columnId}", column_values: ["${payload.columnValue}"]}]) {
                    items {
                        id
                    }
                }
            }
        `;
            const res = await this.monday.api(query).then(res => res.data.items_page_by_column_values.items[0]);


            if (!isNaN(res)) {
                console.log("Item exists with ID:", res);
                return res
            } else {
                console.log("Item does not exist or ID is not a valid number");
                return null;
            }
        }
        catch (e) {
            console.log(e)
            return e
        }
    }

    @OnEvent("marketplace.get-from-monday")
    async handleMarketplaceGetFromMondayEvent(): Promise<any[]> {
        try {
            let cursor: string | null = null;
            let allItems: any[] = [];

            do {
                const query: string = `
          query {
            boards(ids: [1392725209])  {
            groups(ids: ["group_title"]) {
              items_page(${cursor ? `cursor: "${cursor}",` : ''} limit: 500,  query_params: {
                order_by: [{ column_id: "name" }]
              }) {
                cursor
                items {
                  name
                  id
                  column_values {
                    id
                    value
                    ... on StatusValue {
                      text
                    }
                    ... on DropdownValue  {
                      text
                  }
                  }
                }
              }
            }
          }
        }
        `;

                const res = await this.monday.api(query);
                console.log(res.data.boards[0].groups[0].items_page);
                const items = res.data.boards[0].groups[0].items_page.items;
                allItems = [...allItems, ...items];
                cursor = res.data.boards[0].groups[0].items_page.cursor;
            } while (cursor);

            const marketPlaceObj = await this.mondayService.createMarketplaceObject(allItems);
            const createCandidates = await this.marketplaceService.createAllCandidates(marketPlaceObj);


            return allItems;
        } catch (e) {
          console.log(e)
        }
    }
    @OnEvent("marketplace.get-from-monday-event-new")
    async handleMarketplaceGetFromMondayEventNew(): Promise<any[]> {
        try {
            let cursor: string | null = null;
            let allItems: any[] = [];

            do {
                const query: string = `
      query {
        boards(ids: [1445511186])  {
        groups(ids: ["test_ewa_xlsx77277"]) {
          items_page(${cursor ? `cursor: "${cursor}", limit: 500` : 'limit: 500, query_params: { order_by: [{ column_id: "name" }] }'}) {
            cursor
            items {
              name
              id
              column_values {
                id
                value
                ... on StatusValue {
                  text
                }
                ... on DropdownValue  {
                  text
              }
              }
            }
          }
        }
      }
    }
    `;

                const res = await this.monday.api(query);
                console.log(res)
                const items = res.data.boards[0].groups[0].items_page.items;
                allItems = [...allItems, ...items];
                cursor = res.data.boards[0].groups[0].items_page.cursor;
            } while (cursor);

            const marketPlaceObj = await this.mondayService.createMarketplaceObjectNew(allItems);
            const createCandidates = await this.marketplaceService.createAllCandidates(marketPlaceObj);


            return allItems;
        } catch (e) {
            console.log(e)
        }
    }

    @OnEvent("addToListInMonday", { async: true })
    async handleAddMyListToMondayEvent(payload: any): Promise<any> {
        console.log(payload)
        try {



            const query = `query {
        items(ids: [${payload.userMondayId}]) {
            column_values(ids: ["${payload.connectedBoard}"]) {
                value
            }
        }
      }`;

            const currentValues = await this.monday.api(query);
            const columnValue = JSON.parse(currentValues.data.items[0].column_values[0].value);
            const currentCandidates = columnValue && columnValue.linkedPulseIds ? columnValue.linkedPulseIds.map(item => item.linkedPulseId) : [];
            currentCandidates.push(payload.candidateMondayId);
            console.log(currentCandidates)

            const columnValues = {
                [payload.connectedBoard]: {
                    "item_ids": currentCandidates
                }
            };

            const mutation = `mutation {
        change_multiple_column_values(item_id:${payload.userMondayId}, board_id:${payload.boardId}, column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}") {
            id
        }
      }`;

            const res = await this.monday.api(mutation);
            if (!isNaN(res)) {
                return res;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    @OnEvent("addMultipleItemInList", { async: true })
    async handleAddMultipleItemInListEvent(payload: any): Promise<any> {
        try {
            const businessOwner = await this.businessOwnerRepository.findOneOrFail({where: {mondayId: payload.userMondayId}, relations: ["myList","shortList","acceptedList","rejectedList","iewaList" ]});

            const currentMyList = businessOwner.myList.map(item => item.mondayId);
            const currentShortList = businessOwner.shortList.map(item => item.mondayId);
            const currentAcceptedList = businessOwner.acceptedList.map(item => item.mondayId);
            const currentRejectedList = businessOwner.rejectedList.map(item => item.mondayId);
            const iewaList = businessOwner.iewaList.map(item => item.id);


            const columnValues = {
                "connect_boards19": {
                    "item_ids": currentMyList
                },
                "connect_boards9": {
                    "item_ids": currentShortList
                },
                "connect_boards95": {
                    "item_ids": currentAcceptedList
                },
                "connect_boards953": {
                    "item_ids": currentRejectedList
                },
                "connect_boards5": {
                    "item_ids": iewaList
                }
            };

            const mutation = `mutation {
        change_multiple_column_values(item_id:${payload.userMondayId}, board_id:1399424616, column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}") {
            id
        }
      }`;
            console.log(columnValues)

            const res = await this.monday.api(mutation);
            if (!isNaN(res)) {
                return res;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    @OnEvent("removeFromListInMonday", { async: true })
    async handleRemoveMyListFromMondayEvent(payload: AddToListPayloadType) {
        try {
            const query = `query {
  items(ids: [${payload.userMondayId}]) {
    column_values(ids: ["${payload.connectedBoard}"]) {
      value
    }
  }
}`;

            const currentValues = await this.monday.api(query);
            let currentCandidates = JSON.parse(currentValues.data.items[0].column_values[0].value).linkedPulseIds.map(item => item.linkedPulseId);
            currentCandidates = currentCandidates.filter(item => item !== payload.candidateMondayId);


            const columnValues = {
                [payload.connectedBoard]: {
                    "item_ids": currentCandidates
                }
            };

            const mutation = `mutation {
  change_multiple_column_values(item_id:${payload.userMondayId}, board_id:${payload.boardId}, column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}") {
    id
  }
}`;
            const res = await this.monday.api(mutation);
            console.log(res)
            if (!isNaN(res)) {
                return res
            }
        }
        catch (e) {
            console.log(e)
            return e
        }
    }

    @OnEvent("createInterviewInMonday", { async: true })
    async createAndAssignInterview(payload:CreateInterviewPayloadType) {
        try {
            let mutation = `mutation {
            create_item (board_id:${payload.boardId}, item_name:"${payload.itemName}") {
                id
            }
        }`;
            let res = await this.monday.api(mutation);
            const newItemId = res.data.create_item.id;


            const columnValues = {
                [payload.talentPoolConnectedBoard]: {
                    "item_ids": [payload.candidateMondayId]
                },
                [payload.clientConnectedBoard]: {
                    "item_ids": [payload.userMondayId]
                },
                ...payload.form

            };
            mutation = `mutation {
            change_multiple_column_values(item_id:${newItemId}, board_id:${payload.boardId}, column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}") {
                id
            }
        }`;
            res = await this.monday.api(mutation);
            const interview = await this.interviewRepository.findOne({where: {id: payload.interviewId}});
            interview.mondayId = newItemId;
            await this.interviewRepository.save(interview);
            if (!isNaN(res)) {

                return res;
            }
        }
        catch (e) {
            console.log(e);
            return e;
        }
    }

    @OnEvent("createItemUpdateInMonday", { async: true })
    async createItemUpdateInMonday(payload: CreateItemUpdatePayloadType) {
        console.log(payload.body);
        try {
            let query = `mutation {create_update (item_id: ${payload.itemId}, body: \"${payload.body.replace(/"/g, '\\"')}\") { id }}`;
            const res = await this.monday.api(query);
            console.log(res);
            if (!isNaN(res)) {
                return res;
            }
        }
        catch (e) {
            console.log(e);
            return e;
        }
    }

    @OnEvent("updateItemInMonday", { async: true })
    async updateItemInMonday(payload: UpdateItemInMondayPayloadType) {
        try {
            const mutation = `mutation {
    change_multiple_column_values (board_id: ${payload.boardId}, item_id: ${payload.itemId}, column_values: "${JSON.stringify(payload.body).replace(/"/g, '\\"')}") {
        id
    }
}`;
            const res = await this.monday.api(mutation);
            console.log(res);
            if (!isNaN(res)) {
                return res;
            }
        }
        catch (e) {
            console.log(e);
            return e;
        }
    }

    @OnEvent("checkListAndAddToListInMonday", { async: true })
    async checkListAndAddToListInMonday(payload: any) {
        try {
            const businessOwner = await this.businessOwnerRepository.findOneOrFail({ where: { id: payload.userId }, relations: ["myList","shortList","acceptedList"] });
            if (payload.type === "myList" || payload.type === "shortList")
            {
                await this.handleAddMultipleItemInListEvent({
                    connectedBoard: "connect_boards19",
                    boardId: "1399424616",
                    userMondayId: payload.userMondayId,
                    candidateMondayId: businessOwner.myList.map(item => item.mondayId)
                })
                setTimeout(async () => {
                    await this.handleAddMultipleItemInListEvent({
                        connectedBoard: "connect_boards9",
                        boardId: "1399424616",
                        userMondayId: payload.userMondayId,
                        candidateMondayId: businessOwner.shortList.map(item => item.mondayId)
                    })
                }, 4000);
            }

        } catch (e) {
            console.log(e);
            return e;
        }

    }

    @OnEvent("getMyInvoices", { async: true })
    async searchByColumnValuesAndGetLinkedItems(payload: any) {
        try {
            const query = `query {
  items (ids:[${payload.itemId}]) {
    column_values (ids: ["connect_boards6"]) {
      ... on BoardRelationValue {
        linked_item_ids
        linked_items {
          id
          name
          column_values {
          id
                value
            ... on StatusValue {
              text
            }
            ... on TextValue {
              text
            }
              ... on FileValue {
                    files
                    id
                    
                }
            ... on DateValue {
              date
            }
          }
        }
      }
    }
  }
}`;
            const res = await this.monday.api(query).then(res => res.data.items[0].column_values[0].linked_items);
            const businessOwner = await this.businessOwnerRepository.findOneOrFail({where: {id: payload.userId}});
            const invoices = await this.invoiceService.createAllInvoices(res, businessOwner);
            return res;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @OnEvent("getMyRequests", { async: true })
    async getMyRequests(payload: any) {
        try {
            const query = `query {
  items (ids:[${payload.itemId}]) {
    column_values (ids: ["board_relation"]) {
      ... on BoardRelationValue {
        linked_item_ids
        linked_items {
          id
          name
          column_values {
          id
                value
            ... on StatusValue {
              text
            }
            ... on TextValue {
              text
            }
              ... on FileValue {
                    files
                    id
                    
                }
            ... on DateValue {
              date
            }
            ... on DropdownValue {
                text
                }
                
          }
        }
      }
    }
  }
}`;
            const res = await this.monday.api(query).then(res => res.data.items[0].column_values[0].linked_items);
            const businessOwner = await this.businessOwnerRepository.findOneOrFail({where: {id: payload.userId}});
            const requests = await this.requestsService.createAllRequests(res, businessOwner);
            return res;
        } catch (e) {
            console.log(e);
            return e;
        }
    }


    @OnEvent("getIewaList", { async: true })
    async getIewaList(payload: any) {
        try {
            const query = `query {
  items (ids:[${payload.itemId}]) {
    column_values (ids: ["connect_boards5"]) {
      ... on BoardRelationValue {
        linked_item_ids
        linked_items {
          id
          name
          column_values {
          id
                value
            ... on StatusValue {
              text
            }
            ... on TextValue {
              text
            }
              ... on FileValue {
                    files
                    id
                    
                }
            ... on DateValue {
              date
            }
            ... on DropdownValue {
                text
                }
                
          }
        }
      }
    }
  }
}`;
            const res = await this.monday.api(query).then(res => res.data.items[0].column_values[0].linked_items);
            const businessOwner = await this.businessOwnerRepository.findOneOrFail({where: {id: payload.mondayId}});
            const marketPlaceObj = await this.mondayService.createMarketplaceObject(res);

            marketPlaceObj.map(async (item) => {
                const exiest = await this.iewaListRepository.findOne({ where: { id: item.id } })
                if (!exiest) {
                    const candidate = await this.iewaListRepository.create(item)
                    await this.iewaListRepository.save({
                        businessOwner: businessOwner,
                        ...candidate
                    })
                } else {


                }


            })
            return res;
        } catch (e) {
            console.log(e);
            return e;
        }

    }

    @OnEvent("monday-update-item")
    async handleMondayUpdateItemEvent(payload: any) {
        try {
            const columnValuesString = JSON.stringify(payload.form).replace(/"/g, '\\"');
            const mutation = `mutation {
                change_multiple_column_values(item_id:${payload.itemId}, board_id:${payload.boardId}, column_values: "${columnValuesString}") {
                    id
                }
            }`;
            const res = await this.monday.api(mutation).then(res => res);

            if (!isNaN(res)) {
                return res
            }
        }
        catch (e) {
            console.log(e)
            return e
        }
    }

    @OnEvent("check-users-interviews")
    async handleCheckUsersInterviewsEvent() {
        try {
            const interviews = await this.interviewRepository.find();
            interviews.map(async (interview) => {
                const queryMultiple = `query {
                    items (ids: [${interview.mondayId}]) {
                        column_values {
                            id
                            value
                            
                            ... on StatusValue {
                                text
                            }
                            ... on DropdownValue {
                                text
                            }
                            ... on DateValue {
                                date
                            }
                            
                        }
                        }
                        }
                        `
                    const res = await this.monday.api(queryMultiple).then(res => res?.data?.items[0]?.column_values);
                    const findDate = res?.find(item => item?.id === "date_1")?.date;
                    const status = res?.find(item => item?.id === "status")?.text;
                    const accepted = res?.find(item => item?.id === "dup__of_status")?.text;

                    if (status && accepted) {
                        interview.status = status;
                        interview.acceptionStatus = accepted;
                        await this.interviewRepository.save(interview);
                    } else {
                        console.error("Error: Unable to find status or accepted values in the response.");
                    }



                }
            )
        }
        catch (e) {
            console.log(e)
            return e
        }
    }





}