import * as uuid from 'uuid';

export class CommonUtil {
    
    /**
     * 获取客户端IP
     * @param req 
     * @returns {string}
     */
    public static getClientIp(req): string {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress || '';
    }

    /**
     * 获取uuid
     * @returns {string}
     */
    public static getUuid(): string {
        return uuid.v4().replace(/-/g, '');
    }


    public static buildMenu(menus) {
        // console.log("menus>>>>", menus)
        const menu = [];
        for (const m of menus) {
            if (m.pid == 0) {
                CommonUtil.buildTree(m, menus);
                menu.push(m);
            }
        }
        // debug("api:menu:buildmenu2")("buildMenu", menu);
        return menu;
    }

    /**
     * 递归生成菜单树
     *
     * @private
     * @static
     * @param {any} m
     * @param {any} menus
     * @memberof System
     */
    private static buildTree(m: any, menus: any) {
        // debug("api:menu:buildTree")("m", m);
        // debug("api:menu:buildTree")("menus:%o", menus);
        for (const menu of menus) {
            menu.hidden = menu.display === 1 ? false : true;
            if (menu.pid === m.menuId) {
                if (!m.children) {
                    m.children = [];
                }
                m.children.push(menu);
                this.buildTree(menu, menus);
            }
        }
    }
}