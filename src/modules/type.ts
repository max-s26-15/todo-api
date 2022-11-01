import {HttpStatus} from "@nestjs/common";
import {ApiProperty} from "@nestjs/swagger";

export class NotFoundResponse extends Response {
    @ApiProperty({default: HttpStatus.NOT_FOUND})
    statusCode: number;

    @ApiProperty({default: `Todo with id=% does not exist.`})
    message: string;
}
export class NotAcceptableResponse extends Response {
    @ApiProperty({default: HttpStatus.NOT_ACCEPTABLE})
    statusCode: number;

    @ApiProperty({default: `Unknown status 'name of status'`})
    message: string;
}