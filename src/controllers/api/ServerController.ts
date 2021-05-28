import e, { Request, Response } from 'express';
import {
    Body, BodyParam, Controller, Delete, Get, Param, Post, Put, QueryParam, QueryParams, Req, Res, CurrentUser, UploadedFile
} from 'routing-controllers';
import { Inject } from 'typedi';

import { CustomEror } from '../../common/customError';
import { User } from '../../models/api/UserModel';
import { config } from '../../config/config';
import { CommonUtil } from '../../common/common'
import { fileUploadOptions } from '../../common/multer'
import fs from "fs"
import unzipper from "unzipper"


@Controller('')
export class UserController {
    /**
     * 上传h5包道服务器并解压
     * @param req 
     * @param res 
     * @param user 
     * @returns 
     */
    @Post('/server/uploadH5')
    async uploadH5(
        @CurrentUser( { required: true } ) user: User,
        @UploadedFile('file', { options: { dest: 'uploads/' } }) file: any
    ): Promise<Object> { 
        console.log("file>>>", file)
        let data = fs.readFileSync(file.path);
        if(!data){
            throw new CustomEror("upload faild")
            return;
        }
        console.log("data:",data);

        console.log("targetDir:", config.h5path);

        let targetDir = config.h5path
        // 解压文件到指定目录
        // await unzipper.Open.file(file.path)
        //      .then(d => d.extract({path: targetDir, concurrency: 5}));

        fs.createReadStream(file.path)
        .pipe(unzipper.Extract({ path: targetDir }));

        // await fs.createReadStream(file.path)
        // .pipe(unzipper.Parse()) //.pipe(unzipper.Extract({ path: 'output/path' }));
        // .on('entry', function (entry) {
        //     console.log("entry>>>", entry)
        //     const tmpFilePath = targetDir + "/" + iconv.decode(entry.props.pathBuffer, 'gbk');
        //     const type = entry.type; // 'Directory' or 'File'
        //     if (type === "File") {
        //         entry.pipe(fs.createWriteStream(tmpFilePath));
        //     } else if(type === "Directory" && !fs.existsSync(tmpFilePath)) {
        //         fs.mkdirSync(tmpFilePath);
        //     }
        // })
        // .promise().then(function (e) {
        //     if (!e) {
        //         console.log("解压成功");
        //     }
        // })

        //删除文件
        fs.unlink(file.path,() => {

        });
        return 
    }
     
}