import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Company } from "./entities/companies.enity";
import { Model } from "mongoose";

@Injectable()
export class CompaniesService {
    constructor(@InjectModel(Company.name) private companyModel: Model<Company>) {}
}