import { Menu } from "./MenuModel"
export interface User {
    userId: string;
    nickName: string;
    username: string;
    roleId: number;
    role: string;
    gender: number;
    password: string;
    reg_ip: string;
    last_login_time: number;
    last_login_ip: string;
    introduction: string;
    avatar: string;
    status: StatusEnum;
    isDeleted: number;
}

export enum StatusEnum {
    invalid = 0,
    valid = 1
}

