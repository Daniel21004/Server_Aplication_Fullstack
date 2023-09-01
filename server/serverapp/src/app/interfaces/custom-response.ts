import { Server } from "./server";

export interface CustomResponse {
    timeStamp: Date,
    statusCode: number,
    status: string,
    reason: string,
    message: string,
    developerMessage: string,
    //* Indicate that the servers and server properties, may not be in the response
    data: { servers?: Server[], server?: Server } //* Because the API can return two things, an array of servers(in the "Get all servers" case) or a server object(in the "Get server by ID" case)
}