export interface AddToListPayloadType {
    connectedBoard:string
    boardId:string
    userMondayId:string
    candidateMondayId:string
}

export interface CreateInterviewPayloadType {
    boardId:string
    groupId:string
    itemName:string
    userMondayId:string
    candidateMondayId:string
    talentPoolConnectedBoard:string
    clientConnectedBoard:string
    form:object
    interviewId:number
}

export interface CreateItemUpdatePayloadType {
    itemId:string
    body:string
}

export interface UpdateItemInMondayPayloadType {
    itemId:string
    body:object
    boardId:string
}


