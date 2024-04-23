import {Controller, Post, UseGuards} from "@nestjs/common";
import {BusinessOwner} from "../Models/BusinessOwner";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CheckApiKeyMiddleware} from "../Guards/checkApiKey.guard";


@Controller('seed')
@UseGuards(CheckApiKeyMiddleware)
export class SeedController {
    constructor(
        @InjectRepository(BusinessOwner) private businessOwnerRepository: Repository<BusinessOwner>,
    ) {
    }


    @Post("add")
    async add() {
        try {
            const bulkUsers = [

                    {
                        "id": 1,
                        "phoneNumber": "966539343301",
                        "name": null,
                        "fullName": "عبدالعزيز العصيمي",
                        "mondayId": "1475549485",
                        "email": "abdualziz@techsea-sa.com",
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjUzOTM0MzMwMSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJhYmR1YWx6aXpAdGVjaHNlYS1zYS5jb20iLCJkYXRlIjoiMjAyNC0wNC0yMlQwOTo1NTo1My4xMTVaIiwiaWF0IjoxNzEzNzc5NzUzLCJleHAiOjE3MTQzODQ1NTN9.qOWiQuq0_ngD3SN6Ntpy_gCI5zpaRWSMr-jcwVjoQLQ",
                        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjUzOTM0MzMwMSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJhYmR1YWx6aXpAdGVjaHNlYS1zYS5jb20iLCJkYXRlIjoiMjAyNC0wNC0yMlQwOTo1NTo1My4xMThaIiwiaWF0IjoxNzEzNzc5NzUzLCJleHAiOjE3MTQzODQ1NTN9.NIZfQxddCsftMIAy_Im_YqxVHDOOZNA0k1khLTj0Pr4",
                        "password": "$2b$10$6eJpeBvsBdKO3ml1/MrREOYfd7nkATmdDc/qc8B.MkhZbqBv/SfI6",
                        "company_name": "techsea"
                    },
                    {
                        "id": 2,
                        "phoneNumber": "966565604010",
                        "name": null,
                        "fullName": "محمد العمران",
                        "mondayId": "1476626467",
                        "email": "m.alomran@coffeemoments.net",
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjU2NTYwNDAxMCIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJtLmFsb21yYW5AY29mZmVlbW9tZW50cy5uZXQiLCJkYXRlIjoiMjAyNC0wNC0yMlQwOTo1ODo0My44MDZaIiwiaWF0IjoxNzEzNzc5OTIzLCJleHAiOjE3MTQzODQ3MjN9.y8Ywh06F7GESN2JZCnnNE0b00Pz6ctLYu0C-C2Ol9wU",
                        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjU2NTYwNDAxMCIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJtLmFsb21yYW5AY29mZmVlbW9tZW50cy5uZXQiLCJkYXRlIjoiMjAyNC0wNC0yMlQwOTo1ODo0My44MDhaIiwiaWF0IjoxNzEzNzc5OTIzLCJleHAiOjE3MTQzODQ3MjN9.86vC95tSyrgN7HZaAz7ThOza_hofyFowAf9EdXV_GT8",
                        "password": "$2b$10$wUP/q5FFpqhGtLgk5zldb..X4OP0Hy26GLm1kd1VQwg4sws6dqtaK",
                        "company_name": "Hospitality Solutions"
                    },
                    {
                        "id": 3,
                        "phoneNumber": "966562141705",
                        "name": null,
                        "fullName": "Fahad Almeansour",
                        "mondayId": "1476639087",
                        "email": "m.alomran@coff33moments.net",
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjU2MjE0MTcwNSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJtLmFsb21yYW5AY29mZjMzbW9tZW50cy5uZXQiLCJpYXQiOjE3MTM3ODAzNzAsImV4cCI6MTcxNDM4NTE3MH0.D2PH5C8Dxf1DcoxXTwvQnD_d3iWlL7LTJPNdupQvQrc",
                        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjU2MjE0MTcwNSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJtLmFsb21yYW5AY29mZjMzbW9tZW50cy5uZXQiLCJpYXQiOjE3MTM3ODAzNzAsImV4cCI6MTcxNDM4NTE3MH0.D2PH5C8Dxf1DcoxXTwvQnD_d3iWlL7LTJPNdupQvQrc",
                        "password": "$2b$10$MAu8bDaVkavD7eFmfmq1B.PKWchoW4nl1bo0beAx.G9OQXNaoVMN2",
                        "company_name": "Eqwa"
                    },
                    {
                        "id": 4,
                        "phoneNumber": "966200109015",
                        "name": null,
                        "fullName": "majed halis ",
                        "mondayId": "1476697266",
                        "email": "majed.hlis.89@gmail.com",
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjIwMDEwOTAxNSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJtYWplZC5obGlzLjg5QGdtYWlsLmNvbSIsImlhdCI6MTcxMzc5MzE4MCwiZXhwIjoxNzE0Mzk3OTgwfQ.yDWJ3ePluuVqOrRUCMFIWLBvoShUygTI5avDyaRLFls",
                        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjIwMDEwOTAxNSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJtYWplZC5obGlzLjg5QGdtYWlsLmNvbSIsImlhdCI6MTcxMzc5MzE4MCwiZXhwIjoxNzE0Mzk3OTgwfQ.yDWJ3ePluuVqOrRUCMFIWLBvoShUygTI5avDyaRLFls",
                        "password": "$2b$10$AcImHxwd8nRjOpQLTT6y/.90mLDbPAinCmybz3Epj/8Zi9w7WNsBO",
                        "company_name": "Raysan Information Technology Company"
                    },
                    {
                        "id": 5,
                        "phoneNumber": "966500608895",
                        "name": null,
                        "fullName": "Abdulaziz Asiri",
                        "mondayId": "1476703582",
                        "email": "info2030@pbs.sa",
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjUwMDYwODg5NSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJpbmZvMjAzMEBwYnMuc2EiLCJpYXQiOjE3MTM3OTI0NTEsImV4cCI6MTcxNDM5NzI1MX0.BXlqtoEr2uxAGp0zz1qb9NurenYyoIBw6EBUutbGgVM",
                        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjUwMDYwODg5NSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJpbmZvMjAzMEBwYnMuc2EiLCJpYXQiOjE3MTM3OTI0NTEsImV4cCI6MTcxNDM5NzI1MX0.BXlqtoEr2uxAGp0zz1qb9NurenYyoIBw6EBUutbGgVM",
                        "password": "$2b$10$gwnaAOwL1ZKyGJOLMrYc5uyjNQl4cxQv3k6lrKEuta0C.Coh3sgiy",
                        "company_name": "Professional Business Solutions"
                    },
                    {
                        "id": 6,
                        "phoneNumber": "966569007505",
                        "name": null,
                        "fullName": "MOHAMED IBRAHIM",
                        "mondayId": "1476716887",
                        "email": "MOHAMED@IEWA.IO",
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjU2OTAwNzUwNSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJNT0hBTUVEQElFV0EuSU8iLCJkYXRlIjoiMjAyNC0wNC0yMlQxMDozNjo1OS41NTFaIiwiaWF0IjoxNzEzNzgyMjE5LCJleHAiOjE3MTQzODcwMTl9.iaQMZXck2hIhQEjII2FNpCzMOsNFvbPrCDdZRI1rCug",
                        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjU2OTAwNzUwNSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJNT0hBTUVEQElFV0EuSU8iLCJkYXRlIjoiMjAyNC0wNC0yMlQxMDozNjo1OS41NTNaIiwiaWF0IjoxNzEzNzgyMjE5LCJleHAiOjE3MTQzODcwMTl9.H2nq9R9JT09JnoCXD68vHa_npjnQAuNvROGc-9ML3g0",
                        "password": "$2b$10$GPZpyoqvNFS0iW3o4Q8dT.RWJT0Y5KwUelFXQJEBtlizCKBZ4s0ge",
                        "company_name": "IEWA FZU"
                    },
                    {
                        "id": 7,
                        "phoneNumber": "966010057778",
                        "name": null,
                        "fullName": "دينا شعبان ",
                        "mondayId": "1476723231",
                        "email": "dina@iewa.io",
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjAxMDA1Nzc3OCIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJkaW5hQGlld2EuaW8iLCJkYXRlIjoiMjAyNC0wNC0yMlQxMDo0MDoyNy40NjhaIiwiaWF0IjoxNzEzNzgyNDI3LCJleHAiOjE3MTQzODcyMjd9.bW4REnarl6BJF6_aTZBtZnlhBsbe5kG2GGexausq1-8",
                        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjAxMDA1Nzc3OCIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJkaW5hQGlld2EuaW8iLCJkYXRlIjoiMjAyNC0wNC0yMlQxMDo0MDoyNy40NjlaIiwiaWF0IjoxNzEzNzgyNDI3LCJleHAiOjE3MTQzODcyMjd9.EZK3UU8r83uUWYoRyAi5G6C-PeDmPygB48j84dTn2Qo",
                        "password": "$2b$10$Z6hIdVH77JaCvkTUckBobeyVR4oRQ60YDYVWE2pwm9z8LfbeZE0n2",
                        "company_name": "دينا للبرمجيات "
                    },
                    {
                        "id": 8,
                        "phoneNumber": "966050609469",
                        "name": null,
                        "fullName": "maha",
                        "mondayId": "1476763772",
                        "email": "maha@iewa.io",
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjA1MDYwOTQ2OSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJtYWhhQGlld2EuaW8iLCJpYXQiOjE3MTM3ODg2MjcsImV4cCI6MTcxNDM5MzQyN30.Bpe0lnnhct72E7tyFo_FcoUIU92ePMNz5vNgy0KKlh0",
                        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjA1MDYwOTQ2OSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJtYWhhQGlld2EuaW8iLCJpYXQiOjE3MTM3ODg2MjcsImV4cCI6MTcxNDM5MzQyN30.Bpe0lnnhct72E7tyFo_FcoUIU92ePMNz5vNgy0KKlh0",
                        "password": "$2b$10$cq.AXTmm2Go94hhD/zHrT.ZDp2WuANV5oFkrrvveFQIUjOwUOZ82q",
                        "company_name": "test"
                    },
                    {
                        "id": 9,
                        "phoneNumber": "966562131705",
                        "name": null,
                        "fullName": "Fahad Almansour",
                        "mondayId": "1476986251",
                        "email": "m.alomran@coements.net",
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjU2MjEzMTcwNSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJtLmFsb21yYW5AY29lbWVudHMubmV0IiwiaWF0IjoxNzEzNzkwMzc0LCJleHAiOjE3MTQzOTUxNzR9.ODkOhLpvepVT2n2w4l-_AQDVV8kAeo51u3Yl5tPWe-c",
                        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjU2MjEzMTcwNSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJtLmFsb21yYW5AY29lbWVudHMubmV0IiwiaWF0IjoxNzEzNzkwMzc0LCJleHAiOjE3MTQzOTUxNzR9.ODkOhLpvepVT2n2w4l-_AQDVV8kAeo51u3Yl5tPWe-c",
                        "password": "$2b$10$ciRn2q.4ht1EsMSeMs16u.L1Mm4d/nW4Jki8nn7DS7jgu/fUYly3e",
                        "company_name": "LUN COMPANY"
                    },
                    {
                        "id": 10,
                        "phoneNumber": "966559695971",
                        "name": null,
                        "fullName": "رائد عضابي",
                        "mondayId": "1477506895",
                        "email": "rayedodabi@gmail.com",
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjU1OTY5NTk3MSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJyYXllZG9kYWJpQGdtYWlsLmNvbSIsImlhdCI6MTcxMzc5Mzg4MCwiZXhwIjoxNzE0Mzk4MjgwfQ.ziUFPUtW7xKx_XMmXpWt8rAs3S2iC4NcRpi6FkDoHYY",
                        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijk2NjU1OTY5NTk3MSIsInJvbGUiOiJidXNpbmVzc093bmVyIiwiaWQiOiJyYXllZG9kYWJpQGdtYWlsLmNvbSIsImlhdCI6MTcxMzc5Mzg4MCwiZXhwIjoxNzE0Mzk4MjgwfQ.ziUFPUtW7xKx_XMmXpWt8rAs3S2iC4NcRpi6FkDoHYY",
                        "password": "$2b$10$k5TfBVpZpl.MB2r4G33pQuUzXrcZI3CVYFbHqgMuebrxxwXmpoQQW",
                        "company_name": "Frosty Lashes"
                    }
            ];
            await this.businessOwnerRepository.save(bulkUsers);
        }
        catch (e) {
            console.log(e)
        }
    }
}