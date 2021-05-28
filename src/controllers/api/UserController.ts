import e, { Request, Response } from 'express';
import {
    Body, BodyParam, Controller, Delete, Get, Param, Post, Put, QueryParam, QueryParams, Req, Res
} from 'routing-controllers';
import { Inject } from 'typedi';

import { CustomEror } from '../../common/customError';
import { User } from '../../models/api/UserModel';
import { Role } from '../../models/api/RoleModel';
import { Menu } from '../../models/api/MenuModel';
import { UserService } from '../../services/api/UserService';
import { MenuService } from '../../services/api/MenuService';
import { RoleService } from '../../services/api/RoleService';
import { RolemenuService } from '../../services/api/RoleMenuService';
import * as querystring from 'querystring';
import axios from 'axios';
import { config } from '../../config/config';
import { md5 } from '../../util/crypto'
import { UserSession } from '../../util/userSession';
import * as jw from "jsonwebtoken";
import fs from 'fs'
import path from 'path'
import { PageData } from 'common/pageData';
import { CommonUtil } from '../../common/common'

@Controller('')
export class UserController {

    @Inject()
    userService: UserService;

    @Inject()
    menuService: MenuService;

    @Inject()
    roleService: RoleService;
    
    @Inject()
    rolemenuService: RolemenuService;

    /**
     * 玩家登陆
     * @param req 
     * @param res 
     * @param user 
     * @returns 
     */
    @Post('/system/login')
    async Login(
        @Req() req: Request,
        @Res() res: Response,
        @Body() user: User
    ): Promise<User> {
        const newpwd = md5(`${config.saltStart}.${user.password}.${config.saltEnd}`);
        console.log("newpwd>>>>", newpwd)
        let userInfo = await this.userService.findOne({username: user.username, password: newpwd})
        if (!userInfo) {
            throw new CustomEror("username or password error")
        }
        const cert = fs.readFileSync(
            path.join(__dirname, "../../../config/rsakey/rsa_key_pri.key")
          );
        let usertoken = jw.sign(
            {userId: userInfo.userId, username: userInfo.username, roleId: userInfo.roleId},
            cert,
            {
              expiresIn: "24h",
              algorithm: "RS256"
            }
          );
        UserSession.set(usertoken, userInfo)
        return usertoken
    }

    /**
     * 玩家登陆
     * @param req 
     * @param res 
     * @param user 
     * @returns 
     */
    @Post('/system/logout')
    async Logout(
        @Req() req: Request,
        @Res() res: Response,
        @Body() user: User
    ): Promise<User> {
        UserSession.delete(req.headers.authorization)
        return 
    }

    /**
     * 获取用户信息
     * @param req 
     * @param res 
     * @param user 
     * @returns 
     */
    @Get('/system/userinfo')
    async UserInfo(
        @Req() req: Request,
        @Res() res: Response,
        @QueryParam('token') token: string
    ): Promise<User> {

        let userInfo = UserSession.getUser(token)
        if (!userInfo) {
            throw new CustomEror("user not exist")
        }
        
        return userInfo
    }


    /**
     * 根据角色获取权限
     * @param req 
     * @param res 
     * @param user 
     * @returns 
     */
    @Post('/system/usermenu')
    async usermenu(
        @Req() req: Request,
        @Res() res: Response,
        @BodyParam('role') role: string
    ): Promise<Menu[]> {
        let roleMenu = await this.rolemenuService.find({ roleId: role })
        let menus = await CommonUtil.buildMenu(roleMenu);
        return menus
    }

    /**
     * 获取用户列表
     * @param req 
     * @param res 
     * @param user 
     * @returns 
     */
    @Get('/user/users')
    async users(
        @Req() req: Request,
        @Res() res: Response,
        @QueryParam('username') username: string,
        @QueryParam('page') page: number,
        @QueryParam('pageSize') pageSize: number,
    ): Promise<PageData<User>> {
        let condition: any = {}
        if ( username) {
            condition.username = username
        }
        let projection = {
            isDeleted: 0
        }
        let sort = {
            createdAt: -1
        }
        
        return await this.userService.findByPage(condition, page, pageSize, projection, sort)
    }


    /**
     * 获取所有角色
     * @param req 
     * @param res 
     * @param user 
     * @returns 
     */
    @Get('/role/roles')
    async roles(
        @Req() req: Request,
        @Res() res: Response,
        @QueryParam('roleName') roleName: string,
        @QueryParam('page') page: number,
        @QueryParam('pageSize') pageSize: number,
    ): Promise<PageData<Role>> {
        let condition: any = {}
        if ( roleName) {
            condition.roleName = roleName
        }
        let projection = {
            isDeleted: 0
        }
        let sort = {
            createdAt: -1
        }
        
        return await this.roleService.findByPage(condition, page, pageSize, projection, sort)
    }

    
    /**
     * 获取所有角色
     * @param req 
     * @param res 
     * @param user 
     * @returns 
     */
     @Get('/role/roleall')
     async rolesall(
         @Req() req: Request,
         @Res() res: Response
     ): Promise<Role[]> {
         return await this.roleService.findAll()
     }

    /**
     * 获取角色已有的权限
     * @param req 
     * @param res 
     * @param user 
     * @returns 
     */
     @Post('/role/defaultcheck')
     async defaultcheck(
         @Req() req: Request,
         @Res() res: Response,
         @BodyParam('roleId') roleId: string
     ): Promise<Object> {
        let ownmenus = await this.rolemenuService.find( { roleId }, { menuId: 1 } )
        let menuIds = ownmenus.map(item => {
            return item.menuId
        })
        return menuIds
    }

    /**
     * 授权
     * @param req 
     * @param res 
     * @param user 
     * @returns 
     */
     @Post('/role/userpermission')
     async userpermission(
         @Req() req: Request,
         @Res() res: Response,
         @Body() params: any
     ): Promise<Object> {
        const roleId = params.roleId
        const menuIds = params.menuids

        let aimmenus = await this.menuService.find( { menuId: { $in: menuIds } }, { isDeleted: 0, _id: 0 })

        await this.rolemenuService.romove({ roleId })
        for (let menu of aimmenus) {
            if (menu.pid != '0' && menu.isaction == 1) {
                let pmenu = await this.menuService.findOne({menuId: menu.pid})
                menu.path = pmenu.path + '/' + menu.path
            }
          
            let rolemenu: any = Object.assign( menu, { roleId } )
            rolemenu.rolemenuId = CommonUtil.getUuid()
            await this.rolemenuService.save(rolemenu)
        }
        return menuIds
     }

    
    /**
     * 获取菜单
     * @param req 
     * @param res 
     * @param user 
     * @returns 
     */
    @Post('/menu/menus')
    async menus(
        @Req() req: Request,
        @Res() res: Response
    ): Promise<Menu[]> {
        const data = await  this.menuService.findAll()
        const menus = await CommonUtil.buildMenu(data);
        return menus
    }

    /**
     * 添加菜单
     * @param req 
     * @param res 
     * @param user 
     * @returns 
     */
    @Post('/menu/addmenu')
    async addmenu(
        @Req() req: Request,
        @Res() res: Response,
        @Body() menu: Menu
    ): Promise<Menu> {
        return await this.menuService.save(menu)   //上传h5包   //uploadH5 上传h5接口
    }

    /**
     * 编辑菜单
     * @param req 
     * @param res 
     * @param user 
     * @returns 
     */
    @Post('/menu/editmenu')
    async editmenu(
        @Req() req: Request,
        @Res() res: Response,
        @Body() menu: Menu
    ): Promise<Menu> {
        let rolemenu: any = menu
        await this.rolemenuService.update({ menuId: menu.menuId }, rolemenu)
        return await this.menuService.findOneAndUpdate(menu)
    }


    /**
     * 删除菜单
     * @param req 
     * @param res 
     * @param user 
     * @returns 
     */
    @Post('/menu/delmenu')
    async delmenu(
        @Req() req: Request,
        @Res() res: Response,
        @BodyParam('menuId') menuId: string
    ): Promise<Menu[]> { 
        return await this.menuService.update({menuId}, {isDeleted: 1})
    }
     
}