import * as bcrypt from 'bcrypt';
import { BaseService } from '../BaseService';
import { Inject } from 'typedi';
import { Connection, getConnection, getConnectionManager, getRepository } from 'typeorm';

import { Menu } from '../../models/api/MenuModel';
import menuRepository  from '../../schemas/api/MenuSchema'
import role  from '../../schemas/api/RoleSchema'

export class MenuService extends BaseService<Menu> {
    repository:any = menuRepository;

    usocket: object = {}
    

}