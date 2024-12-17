import { ApiBadRequestException } from "@/utils/exception";

export class FileSizeExceedException extends ApiBadRequestException {
    constructor() {
        super(FileSizeExceedException.name, {
            code: 'FILE_SIZE_EXCEED'
        });
    }
}