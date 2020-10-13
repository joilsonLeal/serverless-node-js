import { QueryInput, AttributeMap } from 'aws-sdk/clients/dynamodb'

export interface DatabaseGatewayInterface {
  query: (params: QueryInput) => Promise<AttributeMap[]>
}