import * as bcrypt from 'bcrypt';
import { BaseService } from '../BaseService';
import { Inject } from 'typedi';
import { Connection, getConnection, getConnectionManager, getRepository } from 'typeorm';

import { Role } from '../../models/api/RoleModel';
import roleRepository  from '../../schemas/api/RoleSchema'

export class RoleService extends BaseService<Role> {
    repository:any = roleRepository;

    usocket: object = {}
    

    async createUser(role: Role): Promise<Role> {
        console.log("this.repository>>>>", this.repository)
        let userinfo = await this.findOne({});
        console.log("this.userinfo>>>>", userinfo)
        return await this.findOne({});
    }

}