import * as bcrypt from 'bcrypt';
import { BaseService } from '../BaseService';
import { Inject } from 'typedi';
import { Connection, getConnection, getConnectionManager, getRepository } from 'typeorm';

import { User } from '../../models/api/UserModel';
import userRepository from '../../schemas/api/UserSchema'
import { config } from '../../config/config';
import { md5 } from '../../util/crypto'

export class UserService extends BaseService<User> {
    repository:any = userRepository;

    usocket: object = {}
    
    
}