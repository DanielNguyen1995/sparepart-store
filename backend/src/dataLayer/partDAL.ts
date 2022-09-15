import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { PartItem } from '../models/PartItem'
import { UpdatePartRequest } from '../requests/UpdatePartRequest'
import { genPresignUrl } from '../attachment/attachementHelper'
import * as uuid from 'uuid'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('part-data-access-layer')

export class PartDAL {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly partsTable = process.env.parts_TABLE,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET) { }

    getParts = async (userId: string): Promise<PartItem[]> => {
        logger.log('info', 'Query all parts under user: '.concat(userId))
        let parts: PartItem[]
        const result = await this.docClient.query({
            TableName: this.partsTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        parts = result.Items as PartItem[]
        return parts
    }

    createPart = async (part: PartItem): Promise<PartItem> => {
        logger.log('info', 'Create new part: '.concat(JSON.stringify(part)))
        await this.docClient.put({
            TableName: this.partsTable,
            Item: part
        }).promise()
        return part
    }

    updatePart = async (userId: string, partNumber: string, updatePart: UpdatePartRequest): Promise<void> => {
        logger.log('info', 'Update part info: '.concat(JSON.stringify({ ...updatePart, userId, partNumber })))
        await this.docClient.update({
            TableName: this.partsTable,
            Key: {
                "userId": userId,
                "partNumber": partNumber
            },
            UpdateExpression: "set #description=:description, inStock=:inStock",
            ExpressionAttributeValues: {
                ":description": updatePart.description,
                ":inStock": updatePart.inStock
            }
        }).promise()
    }

    deletePart = async (userId: string, partNumber: string): Promise<void> => {
        logger.log('info', 'Delete part: '.concat(partNumber))
        await this.docClient.delete({
            TableName: this.partsTable,
            Key: {
                "userId": userId,
                "partNumber": partNumber
            }
        }).promise()
    }

    getUploadURL = async (userId: string, partNumber: string): Promise<string> => {
        const imageId = uuid.v4()
        const presignedUrl = await genPresignUrl(imageId)
        this.docClient.update({
            TableName: this.partsTable,
            Key: {
                partNumber,
                userId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${this.bucketName}.s3.amazonaws.com/${imageId}`,
            }
        }, (err, data) => {
            if (err) {
                logger.log('error', 'Error: '.concat(err.message))
                throw new Error(err.message)
            }
            logger.log('info', 'Created: '.concat(JSON.stringify(data)))
        })
        return presignedUrl
    }
}