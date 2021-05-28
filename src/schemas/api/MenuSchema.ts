import * as bcrypt from 'bcrypt-nodejs';
import * as mongoose from 'mongoose';

import { Menu } from '../../models/api/MenuModel';
import { CommonUtil } from '../../common/common';

type MenuDocument = mongoose.Document & Menu;


const menuSchema = new mongoose.Schema({
    menuId: { type: String, unique: true, default: CommonUtil.getUuid() },
    name: String,
    title: String,
    pid: String,
    path: String,
    icon: String,
    display: { type: Number, default: 1 },
    hidden: { type: Boolean, default: true },
    sort: Number,
    isaction: Number,
    meta: Object,
    isDeleted: { type: Number, default: 0 }
}, {
    timestamps: true
})

const menuRepository = mongoose.model<MenuDocument>('Menu', menuSchema);

const initDatas: Menu[] = 
[
    {
        menuId: "1",
        pid: "0",
        name: '系统设置',
        title: '系统设置',
        path: 'system',
        icon: "clipboard",
        display: 1,
        hidden: false,
        sort: 1,
        isaction: 0,
        meta: {title: "系统设置", icon: "clipboard"},
        isDeleted: 0
    },
    {
        menuId: "11",
        pid: '1',
        name: '用户',
        title: '用户',
        path: 'user',
        icon: "",
        display: 1,
        hidden: false,
        sort: 1,
        isaction: 0,
        meta: {title: "用户", icon: ""},
        isDeleted: 0
    },
    {
        menuId: "111",
        pid: '11',
        name: '添加用户',
        title: '添加用户',
        path: 'addsystemuser',
        icon: "",
        display: 1,
        hidden: false,
        sort: 1,
        isaction: 1,
        meta: {title: "添加用户", icon: ""},
        isDeleted: 0
    },    
    {
        menuId: "112",
        pid: '11',
        name: '编辑用户',
        title: '编辑用户',
        path: 'editsystemuser',
        icon: "",
        display: 1,
        hidden: false,
        sort: 2,
        isaction: 1,
        meta: {title: "编辑用户", icon: ""},
        isDeleted: 0
    },
    {
        menuId: "113",
        pid: '11',
        name: '用户列表',
        title: '用户列表',
        path: 'users',
        icon: "",
        display: 1,
        hidden: false,
        sort: 3,
        isaction: 1,
        meta: {title: "用户列表", icon: ""},
        isDeleted: 0
    },
    {
        menuId: "12",
        pid: '1',
        name: '角色',
        title: '角色',
        path: 'role',
        icon: "",
        display: 1,
        hidden: false,
        sort: 2,
        isaction: 0,
        meta: {title: "角色", icon: ""},
        isDeleted: 0
    },
    {
        menuId: "121",
        pid: '12',
        name: '添加角色',
        title: '添加角色',
        path: 'addrole',
        icon: "",
        display: 1,
        hidden: false,
        sort: 1,
        isaction: 1,
        meta: {title: "添加角色", icon: ""},
        isDeleted: 0
    },
    {
        menuId: "122",
        pid: '12',
        name: '编辑角色',
        title: '编辑角色',
        path: 'editrole',
        icon: "",
        display: 1,
        hidden: false,
        sort: 2,
        isaction: 1,
        meta: {title: "编辑角色", icon: ""},
        isDeleted: 0
    },
    {
        menuId: "123",
        pid: '12',
        name: '角色列表',
        title: '角色列表',
        path: 'roles',
        icon: "",
        display: 1,
        hidden: false,
        sort: 3,
        isaction: 1,
        meta: {title: "角色列表", icon: ""},
        isDeleted: 0
    },
    {
        menuId: "1231",
        pid: "12",
        name: '编辑角色权限',
        title: '编辑角色权限',
        path: 'userpermission',
        icon: "",
        display: 1,
        hidden: false,
        sort: 1,
        isaction: 1,
        meta: {title: "编辑角色权限", icon: ""},
        isDeleted: 0
    },
    {
        menuId: "1241",
        pid: "12",
        name: '获取我已有的菜单',
        title: '获取我已有的菜单',
        path: 'defaultcheck',
        icon: "",
        display: 1,
        hidden: false,
        sort: 4,
        isaction: 1,
        meta: {title: "获取我已有的菜单", icon: ""},
        isDeleted: 0
    },
    {
        menuId: "123",
        pid: "12",
        name: '删除角色',
        title: '删除角色',
        path: 'delrole',
        icon: "",
        display: 1,
        hidden: false,
        sort: 4,
        isaction: 1,
        meta: {title: "删除角色", icon: ""},
        isDeleted: 0
    },
    {
        menuId: "13",
        pid: "1",
        name: '菜单',
        title: '菜单',
        path: 'menu',
        icon: "",
        display: 1,
        hidden: false,
        sort: 3,
        isaction: 0,
        meta: {title: "菜单", icon: ""},
        isDeleted: 0
    },
    {
        menuId: "131",
        pid: '13',
        name: '添加菜单',
        title: '添加菜单',
        path: 'addmenu',
        icon: "",
        display: 1,
        hidden: false,
        sort: 1,
        isaction: 1,
        meta: {title: "添加菜单", icon: ""},
        isDeleted: 0
    },
    {
        menuId: "132",
        pid: '13',
        name: '编辑菜单',
        title: '编辑菜单',
        path: 'editmenu',
        icon: "",
        display: 1,
        hidden: false,
        sort: 2,
        isaction: 1,
        meta: {title: "编辑菜单", icon: ""},
        isDeleted: 0
    },
    {
        menuId: "133",
        pid: '13',
        name: '菜单列表',
        title: '菜单列表',
        path: 'menus',
        icon: "",
        display: 1,
        hidden: false,
        sort: 3,
        isaction: 1,
        meta: {title: "菜单列表", icon: ""},
        isDeleted: 0
    },
    {
        menuId: "134",
        pid: '13',
        name: '删除菜单',
        title: '删除菜单',
        path: 'delmenu',
        icon: "",
        display: 1,
        hidden: false,
        sort: 4,
        isaction: 1,
        meta: {title: "删除菜单", icon: ""},
        isDeleted: 0
    },
];
initData()
async function initData() {
    for (const ele of initDatas) {
        const exist = await menuRepository.findOne({ menuId: ele.menuId });
        if (!exist) await new menuRepository(ele).save()
    }
}
export default menuRepository;
