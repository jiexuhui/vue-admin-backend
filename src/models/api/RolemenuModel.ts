import { Menu } from "./MenuModel"
export interface Rolemenu {
    rolemenuId: string,
    roleId: string,
    menuId: string,
    name: string;
    title: string;
    path: string;
    icon: string;
    pid: string,
    display: DisplayEnum;
    hidden: boolean;
    sort: number;
    isaction: number;
    meta: Object;
    isDeleted: number;
}


export enum DisplayEnum {
    DISPLAY = 1,
    HIDDEN = 0
}


