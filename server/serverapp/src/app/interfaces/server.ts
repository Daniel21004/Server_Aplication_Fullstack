import { Status } from "../enum/status.enum";

//* This interface is for mapping the "Server" returned by the API
export interface Server {
    id: number,
    ipAddress: string,
    name: string,
    memory: string,
    type: string,
    imageUrl: string,
    status: Status,
}