

export class UserRegisteredEvent {
    constructor( 
        public userId: string,
        public email : string,
        public varificationjwt: string
    ){
        console.log("new Event created")
    }
}