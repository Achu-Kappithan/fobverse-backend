import { Module } from "@nestjs/common";
import { MongooseModule,} from "@nestjs/mongoose";
import { Company, companyschema } from "./entities/companies.enity";


@Module({
    imports :[
        MongooseModule.forFeature([{name: Company.name,schema:companyschema}])
    ],
    controllers: [],
  providers: [],
  exports: []
})
export class CompaniesModule {} 