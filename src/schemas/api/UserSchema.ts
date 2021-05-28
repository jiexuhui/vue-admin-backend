import * as bcrypt from 'bcrypt-nodejs';
import * as mongoose from 'mongoose';

import { User } from '../../models/api/UserModel';
import { CommonUtil } from '../../common/common';
import { md5 } from '../../util/crypto'
import { config } from '../../config/config';

type UserDocument = mongoose.Document & User;


const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
    nickName: String,
    username: String,
    roleId: Number,
    role: String,
    gender: Number,
    password: String,
    reg_ip: String,
    last_login_time: Number,
    last_login_ip: String,
    introduction: String,
    avatar: String,
    status: { type: Number, default: 1 },
    isDeleted: { type: Number, default: 0 }
}, {
    timestamps: true
})


userSchema.pre('save', function save(this: any, next) {
    const user = this as UserDocument;
    if (!user.isModified('password')) { return next(); }
    user.password = md5(`${config.saltStart}.${user.password}.${config.saltEnd}`);
    next();
})


userSchema.methods.hashPassword = function() {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
};

const userRepository = mongoose.model<UserDocument>('User', userSchema);

const initDatas: User[] = [
    {
        userId: "e5435fd420d247fb8dec3030a03c8d53",
        nickName: "admin",
        username: "admin",
        roleId: 1,
        role: "admin",
        gender: 1,
        password: "3f323050fbffa3ea3295f3719d8b7105",
        reg_ip: "13.211.33.73",
        last_login_time: 1572503245,
        last_login_ip: "115.227.207.43",
        introduction: '我是超级管理员',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        status: 1,
        isDeleted: 0
    },
    {
        userId: "e5435fd420d247fb8dec3030a03c8d54",
        nickName: "4399",
        username: "4399",
        roleId: 1,
        role: "admin",
        gender: 1,
        password: "3f323050fbffa3ea3295f3719d8b7105",
        reg_ip: "13.211.33.73",
        last_login_time: 1572503245,
        last_login_ip: "115.227.207.43",
        introduction: '我是超级管理员',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        status: 1,
        isDeleted: 0
    }
];
initData()
async function initData() {
    for (const ele of initDatas) {
        const exist = await userRepository.findOne({ userId: ele.userId });
        if (!exist) await new userRepository(ele).save()
    }
}
export default userRepository;
