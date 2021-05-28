import * as bcrypt from 'bcrypt';
import { BaseService } from '../BaseService';
import { Inject } from 'typedi';
import { Connection, getConnection, getConnectionManager, getRepository } from 'typeorm';

import { Rolemenu } from '../../models/api/RolemenuModel';
import rolemenuRepository  from '../../schemas/api/RolemenuSchema'

export class RolemenuService extends BaseService<Rolemenu> {
    repository:any = rolemenuRepository;

    usocket: object = {}

    /**
     * 检查角色权限
     */
    async checkRolePerssion(roleId, path) {
        let permission = await this.repository.findOne({roleId, path})

        return !!permission
    }
}