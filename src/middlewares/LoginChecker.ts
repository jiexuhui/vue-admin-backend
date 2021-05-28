import { Func } from 'mocha';
import { ExpressMiddlewareInterface , Middleware } from 'routing-controllers';
import {UserSession} from  "../util/userSession"
import {RolemenuService} from "../services/api/RoleMenuService"
import { Inject } from 'typedi';

const whiteList = [
    "/admin/system/login",
    "/admin/system/logout",
    "/admin/system/userinfo",
    "/admin/system/usermenu"
]
    
@Middleware({ type: 'before' })
export class LoginCheckerMiddleware implements ExpressMiddlewareInterface {

    @Inject()
    rolemenuService: RolemenuService

    async use(request: any, response: any, next: (err?: any) => any): Promise<Object> {
        if (whiteList.indexOf(request.path) >= 0) {
            next()
            return
        }
        const curentUser = UserSession.getUser(request.headers.authorization);
        if (!curentUser) {
            return response.json({
                success: false,
                error: { code: -203, message: 'not login' },
            })
        } 

        let path = request.path.split('/')
        let newpath = new Array(path[2], path[3])
        let newpathstr = newpath.join('/')
        console.log("newpathstr>>>", newpathstr)
        const hasPermission = await this.rolemenuService.checkRolePerssion( curentUser.roleId, newpathstr )
        console.log("hasPermission>>>>>", hasPermission)
        if (!hasPermission) {
            return response.json({
                success: false,
                error: { code: -403, message: 'no persmision' },
            })
        }
        next();
    }
}