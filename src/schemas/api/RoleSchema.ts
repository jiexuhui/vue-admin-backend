import * as bcrypt from 'bcrypt-nodejs';
import * as mongoose from 'mongoose';

import { Role } from '../../models/api/RoleModel';
import { CommonUtil } from '../../common/common';

type RoleDocument = mongoose.Document & Role;


const roleSchema = new mongoose.Schema({
    roleId: { type: String, unique: true },
    roleName: String,
    isDelete: { type: Number, default: 0 }
}, {
    timestamps: true
})



const roleRepository = mongoose.model<RoleDocument>('Role', roleSchema);

const initDatas: Role[] = [
    {
        roleId: "1",
        roleName: "超级管理员",
        isDeleted: 0
    }
];
initData()
async function initData() {
    for (const ele of initDatas) {
        const exist = await roleRepository.findOne({ roleId: ele.roleId });
        if (!exist) await new roleRepository(ele).save()
    }
}
export default roleRepository;
