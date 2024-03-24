// import { Body, Controller, Delete, Get, Post, Put, Req, Res } from '@nestjs/common';
// import { AuthService } from 'src/Service/Auth/auth.service';
// import { InterviewService } from 'src/Service/interview.service';
// import { MondayService } from 'src/Service/monday.service';
//
// @Controller('job-interview')
// export class JobInterviewController {
//     constructor(
//         private readonly mondayService: MondayService,
//         private readonly authService: AuthService,
//         private readonly interviewService: InterviewService
//     ) { }
//
//
//     @Post()
//     async requestJobInterview(@Body() body: any, @Res() res, @Req() req) {
//         try {
//             const token = req.headers.authorization.split(" ")[1];
//             const client = await this.authService.findClient(token)
//             const phoneWithoutPlus = client.phone.replace(/^\+/, '');
//             const convertedDate = new Date(body.date).toISOString().slice(0, 10);
//             const hour24 = body.time === "PM" ? parseInt(body.hour, 10) + 12 : parseInt(body.hour, 10);
//             const correctedHour = (body.hour === 12 && body.time === "AM") ? 0 : (body.hour === 12 && body.time === "PM") ? 12 : hour24;
//
//             const form = {
//                 date_1: convertedDate,
//                 hour: {
//                     hour: correctedHour,
//                     minute: 0
//                 },
//
//
//             }
//             console.log(body)
//
//             const createInterview =  await this.mondayService.createJobInterview(form, body.candidate, client.mondayId)
//             const service = await this.interviewService.createInterview(token, createInterview,body.candidate,convertedDate,correctedHour)
//             if (service) {
//                 return res.status(200).json({
//                     status: 200,
//                 })
//             }
//             setTimeout(async () => {
//                 // const add_to_interview =  await this.mondayService.insertInConnctedBoards(createInterview, 1399424616, "phone", `${phoneWithoutPlus}`, "connect_boards2", res, client.mondayId);
//                 const remove_from_shortlist =  await this.mondayService.removeInConnctedBoards(body.candidate, 1399424616, "phone", `${phoneWithoutPlus}`, "connect_boards1", res, client.mondayId);
//
//             }, 2000)
//
//
//
//
//         } catch (error) {
//             console.log(error)
//         }
//     }
//
//
//     @Put("")
//     async updateInterview(@Body() body: any, @Res() res, @Req() req) {
//         try {
//             const token = req.headers.authorization.split(" ")[1];
//             const client = await this.authService.findClient(token)
//             const phoneWithoutPlus = client.phone.replace(/^\+/, '');
//             console.log(body)
//             const convertedDate = new Date(body.date).toISOString().slice(0, 10);
//             const hour24 = body.time === "PM" ? parseInt(body.hour, 10) + 12 : parseInt(body.hour, 10);
//             const correctedHour = (body.hour === 12 && body.time === "AM") ? 0 : (body.hour === 12 && body.time === "PM") ? 12 : hour24;
//             const monday =  this.mondayService.update_item("1392724674", body.interview, {
//                 date_1: convertedDate,
//                 hour: {
//                     hour: body.hour,
//                     minute: 0
//                 }
//             });
//             const service = await this.interviewService.updateInterview(token, body.interview, body.candidate, convertedDate, correctedHour)
//
//
//             if (service) {
//                 return res.json({
//                     status: 200,
//                 })
//             }
//
//         }
//         catch (error) {
//             console.log(error)
//         }
//     }
//
//
//
//     @Get("get")
//     async get(@Res() res, @Req() req) {
//         try {
//             const token = req.headers.authorization.split(" ")[1];
//             const service = await this.interviewService.getJobInterview(token)
//             console.log(service)
//             if (service) {
//                 return res.json({
//                     status: 200,
//                     data: service.interview
//                 })
//             }
//             // const client = await this.authService.findClient(token)
//             // const phoneWithoutPlus = client.phone.replace(/^\+/, '');
//             // const monday = await this.mondayService.queryByColumnValueAndGetLinkedItemsInboard(1399424616, "phone", phoneWithoutPlus);
//             // const linkedItems = await this.mondayService.returnLinkedItems(monday);
//
//             // const jobInterviewObj = await this.mondayService.createInvterviewObject(linkedItems[6])
//
//             // return res.json({
//             //     status: 200,
//             //     data: jobInterviewObj
//             // })
//
//         }
//         catch (error) {
//             console.log(error)
//             return res.json({ status: 500, data: error })
//         }
//     }
//
//     @Post("remove")
//     async remove(@Req() req, @Res() res, @Body() body) {
//         try {
//             const token = req.headers.authorization.split(" ")[1];
//             const client = await this.authService.findClient(token)
//             const phoneWithoutPlus = client.phone.replace(/^\+/, '');
//             const remove_from_mylist = this.mondayService.removeInConnctedBoards(body.candidate, 1399424616, "phone", `${phoneWithoutPlus}`, "connect_boards", res, client.mondayId);
//             const reason =  this.mondayService.createItemUpdate(body.candidate, `
//               سبب الرفض : ${body.reason}
//               مرحلة الرفض : "قائمتي
//               اسم الشركة : ${client.company_name}
//             `)
//             const addToRejectList = this.mondayService.insertInConnctedBoards(body.candidate, 1399424616, "phone", `${phoneWithoutPlus}`, "connect_boards4", res, client.mondayId);
//             const service = await this.interviewService.rejectCandidate(token, body.interview, body.candidate)
//             if (service) {
//                 return res.json({ status: 200 })
//
//             }
//         } catch (error) {
//             return res.json({ status: 500 })
//         }
//     }
//
// }
