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
import {Interview} from "../Models/Interview.entity";
import {Invoice} from "../Models/Invoice";
import {InvoiceService} from "../Service/invoice.service";
import {RequestsService} from "../Service/requests.service";
import {TraineeService} from "../Service/trainee.service";
import {List} from "../Models/List.entity";


export default class MondayEvents {
    public readonly monday;

    constructor(
        private eventEmitter: EventEmitter2,
        @InjectRepository(Candidate) private candidateRepository: Repository<Candidate>,
        @InjectRepository(BusinessOwner) private businessOwnerRepository: Repository<BusinessOwner>,
        @InjectRepository(Interview) private interviewRepository: Repository<Interview>,
        @InjectRepository(Invoice) private invoicesRepository: Repository<Invoice>,
        @InjectRepository(List) private listRepository: Repository<List>,
        private mondayService: MondayService,
        private marketplaceService: MarketplaceService,
        private invoiceService: InvoiceService,
        private requestsService: RequestsService,
        private traineeService: TraineeService
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

           if (res.data.create_item.id != null) {

               this.eventEmitter.emit("monday-created-item", res.data.create_item.id);

               return res.data.create_item.id
           }




       }
       catch (e) {
           (e)
           return e
       }
    }



    @OnEvent('monday-upload-file')
    async handleMondayUploadFileEvent(payload: any) {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI1NjI2ODAwNSwiYWFpIjoxMSwidWlkIjo0MzIxMDQyOSwiaWFkIjoiMjAyMy0wNS0xM1QxODowODoxNC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTY4OTUwMDAsInJnbiI6ImV1YzEifQ.gvAyLNijyDdaGYoDJTPltn-Po-OyWivKS4IC6Ijmnp8");
            myHeaders.append("API-version", "2023-10");
            myHeaders.append("Cookie", "__cf_bm=tErK1PpuPd.rVe784qCyd5Wax8iJS7F5SLK3MLlTMHE-1712355896-1.0.1.1-Nd9ubPcogfqsdBBY1Uti_qnj538hyVGSZtgtHZQ11BLrbwDJnqpVRHKl3A.zU.WjOmONftiOGLwGY4BII3QYIiOX6Om.KkjzEOSO69EkNW8");
            // myHeaders.append("Content-Type", "multipart/form-data");
            const formdata = new FormData();
            formdata.append("query", `mutation add_file($file: File!) {add_file_to_column (item_id: ${payload.itemId}, column_id:"file" file: $file) {id}}`);
            let blob = new Blob([payload.file.buffer], {type: payload.file.mimetype});
            formdata.append("map", `{"file":"variables.file"}`);
            formdata.append("file", blob, payload.file.originalname);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
                redirect: "follow"
            };

            // @ts-ignore
            fetch("https://api.monday.com/v2/file", requestOptions)
                .then((response) => response.text())
                .then((result) => (result))
                .catch((error) => console.error(error));
        } catch (error) {
            console.error('Error uploading file to Monday.com:', error.response ? error.response.data : error.message);
            return error;
        }
    }
    @OnEvent("monday-get-view-columns")
    async handleMondayGetViewColumnsEvent(payload: any) {
        try {
            const query = `query {
  boards(ids: [${payload.boardId}]) {
    columns {
      id
      title
      type
    }
    items {
      column_values(ids: ["status"]) {
        ... on StatusValue {
          index
          label
          value
        }
      }
    }
    views(ids: [${payload.viewId}]) {
      id
      name
      settings_str
      type
      view_specific_data_str
    }
  }
}`;
            const res = await this.monday.api(query).then(res => res);
            (res.data.boards[0].columns);
            return res;
        }
        catch (e) {
            (e)
            return e
        }
    }
    @OnEvent("monday-create-item-register")
    async handleMondayCreateItemRegisterEvent(payload: any) {
        try {
            const businessOwner = await this.businessOwnerRepository.findOne({where: {id: payload.userId}});
            const query = `
            query {
                items_page_by_column_values (board_id: ${payload.boardId}, columns: [{column_id: "email", column_values: ["${payload.form.email.email}"]}]) {
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

                const columnValues = {
                    "connect_boards6": {
                        "item_ids": []
                    },
                    "link_to_interviews8": {
                        "item_ids": []

                    }
                };

                const mutation = `mutation {
        change_multiple_column_values(item_id:${businessOwner.mondayId}, board_id:1399424616, column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}") {
            id
        }
      }`;

                const res = await this.monday.api(mutation);
                setTimeout(() => {
                    this.eventEmitter.emit("addMultipleItemInList",{
                        userMondayId:businessOwner.mondayId,

                    })
                }, 4000);
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
            (e)
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

                return res
            } else {
                ("Item does not exist or ID is not a valid number");
                return null;
            }
        }
        catch (e) {
            (e)
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
                (res.data.boards[0].groups[0].items_page);
                const items = res.data.boards[0].groups[0].items_page.items;
                allItems = [...allItems, ...items];
                cursor = res.data.boards[0].groups[0].items_page.cursor;
            } while (cursor);

            // const marketPlaceObj = await this.mondayService.createMarketplaceObject(allItems);
            // const createCandidates = await this.marketplaceService.createAllCandidates(marketPlaceObj);


            return allItems;
        } catch (e) {
          (e)
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
                console.log(res.data.boards[0].groups[0].items_page);
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
        (payload)
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
            (currentCandidates)

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
            const businessOwner = await this.businessOwnerRepository.find({where: {mondayId: payload.mondayId}, relations: ['list', 'list.candidate']});
            const myList = businessOwner.flatMap(owner =>
                owner.list.filter(listItem => listItem.type === 'myList')
            );
            const shortList = businessOwner.flatMap(owner =>
                owner.list.filter(listItem => listItem.type === 'shortList')
            );
            const interviewList = businessOwner.flatMap(owner =>
                owner.list.filter(listItem => listItem.type === 'interviewList')
            );
            const acceptedList = businessOwner.flatMap(owner =>
                owner.list.filter(listItem => listItem.type === 'acceptedList')
            );
            const rejectedList = businessOwner.flatMap(owner =>
                owner.list.filter(listItem => listItem.type === 'rejectedList')
            );
            const iewaList = businessOwner.flatMap(owner =>
                owner.list.filter(listItem => listItem.type === 'iewaList')
            );



            const columnValues = {
                "connect_boards19": {
                    "item_ids": myList.map(item => item.mondayId)
                },
                "connect_boards9": {
                    "item_ids": shortList.map(item => item.mondayId)
                },
                "connect_boards95": {
                    "item_ids": acceptedList.map(item => item.mondayId)
                },
                "connect_boards953": {
                    "item_ids": rejectedList.map(item => item.mondayId)
                },
                "connect_boards5": {
                    "item_ids": iewaList.map(item => item.mondayId)
                }
            };

            const mutation = `mutation {
        change_multiple_column_values(item_id:${payload.userMondayId}, board_id:1399424616, column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}") {
            id
        }
      }`;

            const res = await this.monday.api(mutation);

            if (res.data && res.data.change_multiple_column_values.id != null) {
                this.eventEmitter.emit("addMultipleItemInListFinished", { userMondayId: payload.userMondayId });

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
            (res)
            if (!isNaN(res)) {
                return res
            }
        }
        catch (e) {
            (e)
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
            (e);
            return e;
        }
    }

    @OnEvent("createItemUpdateInMonday", { async: true })
    async createItemUpdateInMonday(payload: CreateItemUpdatePayloadType) {
        (payload.body);
        try {
            let query = `mutation {create_update (item_id: ${payload.itemId}, body: \"${payload.body.replace(/"/g, '\\"')}\") { id }}`;
            const res = await this.monday.api(query);
            (res);
            if (!isNaN(res)) {
                return res;
            }
        }
        catch (e) {
            (e);
            return e;
        }
    }


    @OnEvent("create-monday-item-multiple-column-values", { async: true })
    async createItemWithMultipleColumnValues(payload: any) {
        try {
            let mutation = `mutation {
            create_item (board_id: ${payload.boardId}, item_name: "${payload.itemName}") {
                id
            }
        }`;
            let res = await this.monday.api(mutation);
            const newItemId = res.data.create_item.id;

            const columnValues = {...payload.form};

            for (const board of payload.connectedBoards) {
                columnValues[board.boardId] = { "item_ids": board.itemIds };
            }

            mutation = `mutation {
            change_multiple_column_values(item_id: ${newItemId}, board_id: ${payload.boardId}, column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}") {
                id
            }
        }`;
            res = await this.monday.api(mutation);
            (res);

            if (res.data.change_multiple_column_values.id != null) {
                this.eventEmitter.emit("monday-changed-multiple-column-values");
                return res;
            }
        } catch (e) {
            (e);
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
            (res);
            if (!isNaN(res)) {
                return res;
            }
        }
        catch (e) {
            (e);
            return e;
        }
    }

    @OnEvent("checkListAndAddToListInMonday", { async: true })
    async checkListAndAddToListInMonday(payload: any) {
        try {
            // const businessOwner = await this.businessOwnerRepository.findOneOrFail({ where: { id: payload.userId }, relations: ["myList","shortList","acceptedList"] });
            // if (payload.type === "myList" || payload.type === "shortList")
            // {
            //     await this.handleAddMultipleItemInListEvent({
            //         connectedBoard: "connect_boards19",
            //         boardId: "1399424616",
            //         userMondayId: payload.userMondayId,
            //         candidateMondayId: businessOwner.myList.map(item => item.mondayId)
            //     })
            //     setTimeout(async () => {
            //         await this.handleAddMultipleItemInListEvent({
            //             connectedBoard: "connect_boards9",
            //             boardId: "1399424616",
            //             userMondayId: payload.userMondayId,
            //             candidateMondayId: businessOwner.shortList.map(item => item.mondayId)
            //         })
            //     }, 4000);
            // }

        } catch (e) {
            (e);
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
            (e);
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
            (e);
            return e;
        }
    }


    @OnEvent("getIewaList", { async: true })
    async getIewaList(payload: any) {
        try {
            const query = `query {
            items (ids: [${payload.itemId}]) {
                column_values (ids: ["connect_boards5"]) {
                    ... on BoardRelationValue {
                        linked_item_ids
                        linked_items {
                            id
                            name
                        }
                    }
                }
            }
        }`;
            const response = await this.monday.api(query);
            const items = response.data.items[0]?.column_values[0]?.linked_items;

            const businessOwner = await this.businessOwnerRepository.findOneOrFail({
                where: { mondayId: payload.itemId },
                relations: ["list", "list.candidate"]
            });

            if (!items || items.length === 0) {
                // If no items are coming from Monday, delete all "iewaList" from the database
                await this.listRepository.delete({
                    businessOwner: businessOwner,
                    type: "iewaList"
                });
                this.eventEmitter.emit("iewaListFinished");
                return;
            }

            const mondayItemIds = items.map(item => item.id);

            // Delete lists that are in the DB but not coming from Monday
            const listsToDelete = businessOwner.list.filter(listItem =>
                listItem.type === "iewaList" && !mondayItemIds.includes(listItem.candidate.id.toString())
            );

            for (const list of listsToDelete) {
                await this.listRepository.delete({ id: list.id });
            }

            // Proceed with adding or updating lists
            for (const item of items) {
                const candidate = await this.candidateRepository.findOne({
                    where: { id: item.id }
                });
                if (!candidate) {
                    continue; // Skip if candidate does not exist
                }

                const alreadyExistsInAnyList = businessOwner.list.some(listItem =>
                    listItem.candidate.id === candidate.id
                );

                const alreadyExistsInIewaList = businessOwner.list.some(listItem =>
                    listItem.candidate.id === candidate.id && listItem.type === "iewaList"
                );

                if (!alreadyExistsInIewaList && !alreadyExistsInAnyList) {
                    const newList = this.listRepository.create({
                        type: "iewaList",
                        candidate: candidate,
                        businessOwner: businessOwner,
                        presentBy: "مرشح بواسطة ايوا",
                        mondayId: candidate.id
                    });
                    await this.listRepository.save(newList);
                }
            }

            this.eventEmitter.emit("iewaListFinished", items);
        } catch (e) {
            console.error(e);
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
            (e)
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
            (e)
            return e
        }
    }

    @OnEvent("monday-get-trainees")
    async handleMondayGetTraineesEvent() {
        try {
            let cursor: string | null = null;
            let allItems: any[] = [];

            do {
                const query: string = `
          query {
            boards(ids: [1392728485])  {
            groups(ids: ["topics"]) {
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
                (res.data.boards[0].groups[0].items_page);
                const items = res.data.boards[0].groups[0].items_page.items;
                allItems = [...allItems, ...items];
                cursor = res.data.boards[0].groups[0].items_page.cursor;
            } while (cursor);

            const traineeObject = await this.mondayService.createTrainingObject(allItems);
            const createCandidates = await this.traineeService.createAllTrainees(traineeObject);


            return allItems;
        } catch (e) {
            (e)
        }
    }





}