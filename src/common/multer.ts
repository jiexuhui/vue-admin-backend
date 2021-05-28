import * as multer from "multer"

export const fileUploadOptions = () => {
    storage: multer.diskStorage({
        destination: (req: any, file: any, cb: any) => {
            cb(null, '/files/h5')
        }
    })
};