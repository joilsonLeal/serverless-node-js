import AwsFactory from '../factories/AwsFactory';
import LyricRepository from './LyricRepository';

const setEnvVars = () => {
  process.env.AWS_DYNAMO_REGION = 'fake_AWS_DYNAMO_REGION'
}

setEnvVars();

const makeMocks = () => {
    const awsFactory = new AwsFactory();
    awsFactory.buildDynamo = jest.fn().mockReturnValue({
      get: () => ({
        promise: async () => Promise.resolve(
          {
            Items: [
              {
                author: 'adele',
                music: 'hello',
                lyrics: 'hello it\'s me'
              }
            ]
          }
        ),
      }),

    });
    return awsFactory
}

const makeSut = () => {
    const awsFactory = makeMocks()
    const DocumentClientStub = awsFactory.buildDynamo();

    const sut = new LyricRepository(DocumentClientStub);
    return {
      DocumentClientStub,
      sut
    }
}

describe('LyricRepository', () => {

  it(`LyricRepository - should return one music`, async () => {
    afterEach(setEnvVars);
    
    const { sut } = makeSut();
    const data = await sut.insertLyric('adele', 'hello', 'hello its me');
    const get = await sut.getLyric('adele', 'hello');
    console.log(get);
  });

  
});

