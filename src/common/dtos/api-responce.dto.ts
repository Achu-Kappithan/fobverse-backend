import { HttpStatus } from "@nestjs/common"


export class ApiResponce<T> {
    success : boolean
    message : string
    data? : T
    error? :string
    statuscode : HttpStatus

    constructor(success:boolean,message:string, statuscode:HttpStatus=HttpStatus.OK,data?:T,error?:string) {
        this.success = success,
        this.message = message
        this. data = data
        this.error = error
        this.statuscode = statuscode
    }
}