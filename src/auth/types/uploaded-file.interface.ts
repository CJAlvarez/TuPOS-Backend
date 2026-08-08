/**
 * Minimal shape of a multer in-memory file.
 * Declared locally so the project does not need @types/multer.
 */
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}
