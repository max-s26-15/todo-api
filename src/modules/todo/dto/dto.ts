import {ApiProperty} from "@nestjs/swagger";

export class CreateDto {
  @ApiProperty()
  title: string;

  @ApiProperty({required: false})
  status?: string;
}

export class UpdateDto {
  @ApiProperty()
  title: string;

  @ApiProperty({required: false})
  status?: string;
}
