import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreatePartRequest } from '../../requests/CreatePartRequest'
import { getUserId } from '../utils';
import { createPart } from '../../businessLogic/partBLL'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newPart: CreatePartRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    try {
      const newCreatedPart = await createPart(userId, newPart);
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({item: newCreatedPart})
    }
    }
    catch (err) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({message: err})
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
