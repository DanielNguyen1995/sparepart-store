import { PartDAL } from '../dataLayer/partDAL'
import { PartItem } from '../models/PartItem'
import { CreatePartRequest } from '../requests/CreatePartRequest'
import { UpdatePartRequest } from '../requests/UpdatePartRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('part-bussiness-logic-layer')
const partAccess = new PartDAL()

export const getParts = async (userId: string): Promise<PartItem[]> => {
    return await partAccess.getParts(userId);
}

export const createPart = async (userId: string, part: CreatePartRequest): Promise<PartItem> => {
    logger.log('info', 'Received part create request: '.concat(JSON.stringify(part)))
    const partNum = uuid.v4();
    const newPart: PartItem = {
        ...part,
        userId,
        partNum,
        createdAt: new Date().toISOString()
    }
    await partAccess.createPart(newPart);
    return newPart;
}

export const updatePart = async (userId: string, partNum: string, updatePart: UpdatePartRequest): Promise<void> => {
    logger.log('info', 'Received part update request: '.concat(partNum))
    await partAccess.updatePart(userId, partNum, updatePart)
}

export const deletePart = async (userId: string, partNum: string): Promise<void> => {
    logger.log('info', 'Received part delete request: '.concat(partNum))
    await partAccess.deletePart(userId, partNum)
}

export const generateUploadURL = async (userId: string, partNum: string): Promise<string> => {
    logger.log('info', 'Uploading image for part: '.concat(partNum))
    const url = await partAccess.getUploadURL(userId, partNum)
    return url 
}