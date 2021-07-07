import * as AWS from 'aws-sdk';
import AwsFactory from './AwsFactory';

describe('AwsFactory', () => {
  it(`AwsFactory - should throw an exception when AWS_DYNAMO_REGION environment var isn't set`, async () => {
    delete process.env.AWS_DYNAMO_REGION;
    process.env.AWS_SNS_REGION = 'FAKE_VALUE';

    expect(() => new AwsFactory()).toThrow();
  });

  it('AwsFactory#buildDynamo - should return a DynanoDB instance', async () => {
    process.env.AWS_DYNAMO_REGION = 'FAKE_VALUE';

    const awsFactory: AwsFactory = new AwsFactory();
    const dynamo: AWS.DynamoDB.DocumentClient = awsFactory.buildDynamo();

    expect(dynamo).toBeInstanceOf(AWS.DynamoDB.DocumentClient);
  });
})
