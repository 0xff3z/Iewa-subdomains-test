import { Global, Injectable } from '@nestjs/common';
import mondaySdk from 'monday-sdk-js';
import { platform } from 'os';

@Global()
@Injectable()
export class MondayService {
  public readonly monday;

  constructor() {
    this.monday = mondaySdk();
    this.monday.setApiVersion('2023-10');
    this.monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI1NjI2ODAwNSwiYWFpIjoxMSwidWlkIjo0MzIxMDQyOSwiaWFkIjoiMjAyMy0wNS0xM1QxODowODoxNC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTY4OTUwMDAsInJnbiI6ImV1YzEifQ.gvAyLNijyDdaGYoDJTPltn-Po-OyWivKS4IC6Ijmnp8");

  }


  async create_item(board_id: string, group_id: string, formValues: any, item_name) {
    try {

      const columnValuesString = JSON.stringify(formValues).replace(/"/g, '\\"');
      (columnValuesString)

      const mutation = `mutation {
                create_item(
                  board_id: "${board_id}",
                  group_id: "${group_id}",
                  item_name: "${item_name}",
                  column_values: "${columnValuesString}",
                ) { 
                  id 
                }
              }`;

      const res = await this.monday.api(mutation).then(res => res.data.create_item.id);
      (res)

      if (!isNaN(res)) {
        ("ss");
        return res;
      }

    } catch (error) {
      console.error(error);
    }
  }
  async createItemForLogin(companyName, name, email, phone) {
    try {
      const columnValues = JSON.stringify({
        text: name,
        phone: phone,
        email: {
          email: email,
          text: email,
        }
      });
      const mutation = `mutation {
                create_item(
                  board_id: "1399424616",
                  group_id: "topics",
                  item_name: "${companyName}",
                  column_values: "${columnValues.replace(/"/g, '\\"')}"
                  ) { 
                  id 
                }
              }`;

      const res = await this.monday.api(mutation).then(res => res.data.create_item.id);
      (res)

      if (!isNaN(res)) {
        ("ss");
        return res;
      }

    } catch (error) {
      console.error(error);
    }
  }


  async find_items(board_id: string, group_id: string, formValues: any) {
    try {
      const columnValuesObject = {
        ...formValues
      };

      const columnValuesString = JSON.stringify(columnValuesObject).replace(/"/g, '\\"');
      const query = `query {
                items(board_id: "${board_id}", group_id: "${group_id}") {
                  id
                  ${columnValuesString}
                }
              }`;
      (query)
      return query

    }

    catch (error) {
      console.error(error);
    }

  }

  async update_item(board_id: string, item_id: string, columnValues: any) {
    try {
      const columnValuesString = JSON.stringify(columnValues).replace(/"/g, '\\"');

      const mutation = `mutation {
                change_multiple_column_values(
                  board_id: ${board_id},
                  item_id: ${item_id},
                  column_values: "${columnValuesString}"
                ) {
                  id
                }
            }`;

      const res = await this.monday.api(mutation).then(res => res.data.change_multiple_column_values.id);
      (`this is the response ${res}`)
      return res;
    } catch (error) {
      console.error(error);
    }
  }




  async queryByItemId(item_id) {
    const query = `query {
      items(ids: [${item_id}]) {
        id
        name
        column_values {
          id
          text
          ... on StatusValue {
            text
            
          }
          ... on DropdownValue  {
            text
        }
        }
      }
    }`;
    const response = await this.monday.api(query);
    return response.data.items[0];
  }





  async queryByBoardId(board_id, group_id) {
    try {
      if (group_id == "") {
        const query = `
        query {
          boards(ids: [${board_id}])  {
            items_page(query_params: {
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
      `;

        const response = await this.monday.api(query);

        const items = response.data.boards[0]?.items_page?.items || [];





        return items;
      } else {
        const query = `
        query {
          boards(ids: [${board_id}]) {
            groups(ids: ["${group_id}"]) {
              items_page(limit: 100) { 
                items {
                  id
                  name
                  column_values {
                    id
                    value
                    ... on StatusValue {
                      text
                    }
                    ... on DropdownValue {
                      text
                    }
                  }
                }
              }
            }
          }
        }
        `;

        const response = await this.monday.api(query);

        const items = response.data.boards[0].groups[0].items_page.items || [];





        return items;
      }




    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async queryByBoardIdAndAddRules(board_id, group_id) {
    try {
      if (group_id == "") {
        const query = `
        query {
          boards(ids: [${board_id}])  {
            items_page(query_params: {
              order_by: [{ column_id: "name" }],
              rules: [{column_id: "role2", compare_value: [0], operator: any_of}]
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
      `;

        const response = await this.monday.api(query);
        (response)
        const items = response.data.boards[0]?.items_page?.items || [];





        return items;
      } else {
        const query = `
        query {
          boards(ids: [${board_id}]) {
            groups(ids: ["${group_id}"]) {
              items_page(limit: 100) { 
                items {
                  id
                  name
                  column_values {
                    id
                    value
                    ... on StatusValue {
                      text
                    }
                    ... on DropdownValue {
                      text
                    }
                  }
                }
              }
            }
          }
        }
        `;

        const response = await this.monday.api(query);

        const items = response.data.boards[0].groups[0].items_page.items || [];





        return items;
      }




    } catch (error) {
      console.error(error);
      throw error;
    }
  }




  async insertInConnctedBoards(item_id, board_id, column_id, column_value, column_you_update, res, company_id) {
    try {
      const query = `query {
      items_page_by_column_values(
        board_id: ${board_id}, 
        columns:[{column_id: "${column_id}", column_values: "${column_value}"}],
      ) {
        items {
        
          
          name
          column_values(ids: ["${column_you_update}"]) {
            text
            value
          }
        }
      }
    }`;

      const queryres = await this.monday.api(query).then(res => res.data.items_page_by_column_values.items[0].column_values[0].value);
      const json = JSON.parse(queryres);
      (json);
      if (json.linkedPulseIds === null) {
        json.linkedPulseIds = [];
        (json.linkedPulseIds);
      } else {
        const linkedPulseIds = json.linkedPulseIds && json.linkedPulseIds.map(item => item.linkedPulseId) || [];
        linkedPulseIds.push(item_id);
        (`before ${linkedPulseIds}`);
        (`item_id ${item_id}`);
        (`after ${linkedPulseIds}`);

        var updateQuery = `mutation {
      change_multiple_column_values(
        item_id: ${company_id},
        board_id: ${board_id},
        column_values: "{\\"${column_you_update}\\": {\\"item_ids\\": [${linkedPulseIds.join(", ")}]}}"
      ) {
        id
      }
    }`;
        const response = await this.monday.api(updateQuery).then(res => res.data.change_multiple_column_values.id);
        (response);


      }
    }
    catch (error) {
      console.error(error);
    }













  }














  async GenerateAssetURl(asset_id) {
    (asset_id)
    const query = `query {
      assets (ids: [${asset_id}]) {
        id
        name
        public_url
      }
    }`
    const monday = await this.monday.api(query).then(res => res.data.assets[0].public_url);
    return monday
  }

  async querySubItemInItem(item_id) {
    try {
      const query = `query {
        items (ids: [${item_id}]) {
          subitems {
            id
            name
            column_values {
              value
              text
              
            }
          }
        }
      }`;
      const response = await this.monday.api(query).then(res => res.data.items[0].subitems);
      return response

    } catch (error) {

    }

  }











  async createMarketplaceObject(object) {
    if (object.length == 0) {
      ("no items");
    }
    const marketObjects = await Promise.all(object.map(async (item) => {
      const marketObj = {
        name: item.name,
        id: item.id,
        firstName: this.findItemsByid(item.column_values, "text", "text") ? JSON.parse(this.findItemsByid(item.column_values, "text", "text")) : "",
        job: this.findItemsByid(item.column_values, "role2", "dropdown"),
        bio: this.findItemsByid(item.column_values, "long_text", "long_text"),
        yearsOfExperience: this.findItemsByid(item.column_values, "years_of_experience", "number"),
        jobType: this.findItemsByid(item.column_values, "status9", "status"),
        englishLevel: this.findItemsByid(item.column_values, "status", "status"),
        expectedSalary: this.findItemsByid(item.column_values, "numbers", "number"),
        nationality: this.findItemsByid(item.column_values, "nationality8", "status"),
        np: this.findItemsByid(item.column_values, "np6", "text") ? JSON.parse(this.findItemsByid(item.column_values, "np6", "text")) : "",
        gender: this.findItemsByid(item.column_values, "text9", "text"),
        senority: this.findItemsByid(item.column_values, "dropdown0", "dropdown"),
        languages: this.findItemsByid(item.column_values, "dropdown", "dropdown"),
        libraries: this.findItemsByid(item.column_values, "dropdown9", "dropdown"),
        tools: this.findItemsByid(item.column_values, "dropdown6", "dropdown"),
        storage: this.findItemsByid(item.column_values, "dropdown8", "dropdown"),
        frameworks: this.findItemsByid(item.column_values, "dropdown2", "dropdown"),
        paradigms: this.findItemsByid(item.column_values, "dropdown3", "dropdown"),
        platforms: this.findItemsByid(item.column_values, "dropdown5", "dropdown"),
        skills: this.findItemsByid(item.column_values, "dropdown58", "dropdown"),
        project: this.findItemsByid(item.column_values, "link", "text") ? JSON.parse(this.findItemsByid(item.column_values, "link", "text")).title : ""
      };

      return marketObj;
    }));




    return marketObjects;
  }
  async createMarketplaceObjectNew(object) {
    if (object.length == 0) {
      ("no items");
    }
    const marketObjects = await Promise.all(object.map(async (item) => {
      const marketObj = {
        name: item.name || "",
        id: item.id || "",
        firstName: this.findItemsByid(item.column_values, "text", "text") ? JSON.parse(this.findItemsByid(item.column_values, "text", "text")) : "",
        job: this.findItemsByid(item.column_values, "position", "text") || "",
        bio: this.findItemsByid(item.column_values, "long_text", "long_text") || "",
        yearsOfExperience: this.findItemsByid(item.column_values, "long_text2", "long_text") || "",
        yearsOfExperienceTwo: this.findItemsByid(item.column_values, "long_text6", "long_text") || "",
        yearsOfExperienceThree: this.findItemsByid(item.column_values, "long_text0", "long_text") || "",
        yearsOfExperienceFour: this.findItemsByid(item.column_values, "long_text66", "long_text") || "",
        expectedSalary: this.findItemsByid(item.column_values, "numbers4", "number") || "",
        nationality: this.findItemsByid(item.column_values, "status7", "status") || "",
        np: this.findItemsByid(item.column_values, "numbers1", "number") || "",
        courses: this.findItemsByid(item.column_values, "long_text9", "long_text") || "",
        skills: this.findItemsByid(item.column_values, "long_text3", "long_text") || "",
        project: this.findItemsByid(item.column_values, "long_text4", "long_text") || "",
        projectTwo: this.findItemsByid(item.column_values, "long_text45", "long_text") || "",
        projectThree: this.findItemsByid(item.column_values, "long_text60", "long_text") || "",
        currency: this.findItemsByid(item.column_values, "status6", "status") || "",
        education: this.findItemsByid(item.column_values, "long_text5", "long_text") || "",
      };

      return marketObj;
    }));

    return marketObjects;
  }

  async createTrainingObject(object) {
    if (object.length == 0) {
      ("no items");
    }
    const trainneObject = await Promise.all(object.map(async (item) => {
      const traineeObj = {
        mondayId: item.id || "",
        aboutMe: this.findItemsByid(item.column_values, "long_text", "long_text") || "",
        areYouPassedIewaCamp: this.findItemsByid(item.column_values, "status", "status") || "",
        careerPath: this.findItemsByid(item.column_values, "status4", "status") || "",
        college: this.findItemsByid(item.column_values, "status3", "status") || "",
        email: this.findItemsByid(item.column_values, "email", "email") || "",
        englishLevel: this.findItemsByid(item.column_values, "status98", "status") || "",
        favoriteOfWorkplace: this.findItemsByid(item.column_values, "status35", "status") || "",
        name: item.name || "",
        howToWork: this.findItemsByid(item.column_values, "status9", "status") || "",
        major: this.findItemsByid(item.column_values, "status8", "status") || "",
        phoneNumber: this.findItemsByid(item.column_values, "phone", "phone") || "",
        PlaceOfResidence: this.findItemsByid(item.column_values, "color", "status") || "",
        salary: this.findItemsByid(item.column_values, "numbers", "number") || "",
        searchingFor: this.findItemsByid(item.column_values, "status5", "status") || "",
        cv: this.findItemsByid(item.column_values, "file", "file") || "",

      };

      return traineeObj;
    }));
    return trainneObject;
    }



  findItemsByid(items, id, column_type) {
    const foundItem = items.find(item => item && item.id === id);

    if (!foundItem) {
      return null;
    }

    switch (column_type) {
      case "text":
        return foundItem.value || "";
      case "status":
        return foundItem.text;
      case "long_text":
        if (foundItem.value) {
          var parsedValue = JSON.parse(foundItem.value);
          return parsedValue.text || "";
        }
        case "email":
            if (foundItem.value) {
                var parsedValue = JSON.parse(foundItem.value);
                return parsedValue.email || "";
            }
      case "file":
        if (foundItem.value) {
          try {
            const fileDetails = JSON.parse(foundItem.value);
            if (fileDetails.files && fileDetails.files.length > 0) {
              // Returning the assetId of the first file
              return fileDetails.files[0].assetId;
            }
          } catch (e) {
            console.error("Error parsing file details:", e);
          }
        }
        return null;


      case "number":
        if (foundItem.value) {
          return JSON.parse(foundItem.value);
        }
        return null;

        case "phone":
            if (foundItem.value) {
                return JSON.parse(foundItem.value).phone;
            }
            return null;
      case "dropdown":
        if (foundItem.text && foundItem.text.includes(",")) {
          return foundItem.text.split(',').map(item => item.trim());
        } else {
          return foundItem.text;
        }
      case "date":
        return foundItem.date;
      case "hour":
        return foundItem.value;
      case "connect_board":
        return JSON.parse(foundItem.value).linkedPulseIds[0].linkedPulseId;
      default:
        return null;
    }
  }








  async createCandidateExperienceObject(object) {
    try {
      const candidateExperience = await Promise.all(object.map(async (item) => {
        const obj = {
          id: item.id,
          company: item.name,
          Position: item.column_values[0].text,
          from: item.column_values[1].text,
          to: item.column_values[2].text

        }
        return obj
      }))
      return candidateExperience

    } catch (error) {

    }

  }
}


