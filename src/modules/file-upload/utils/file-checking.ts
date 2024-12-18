import { FileUploadDto } from "../dto/file-upload.dto";

export function isImage(fileData: FileUploadDto) {
    return fileData.mimetype.match(/^image\/.*/);
}