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
            Item:
              {
                author: 'adele',
                music: 'hello',
                lyrics: `hello it's me`
              }
          }
        ),
      }),
      put: () => ({
        promise: async () => Promise.resolve({})
      })
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

  afterEach(setEnvVars);

  it('should return a new instance', () => {
    const { sut } = makeSut()

    expect(sut).toBeInstanceOf(LyricRepository)
  });

  it('should throw when no AWS_DYNAMO_REGION env var provided', () => {
    delete process.env.AWS_DYNAMO_REGION

    expect(makeSut).toThrowError('Missing AWS_DYNAMO_REGION environment var')
  });


  it('should return lyrics when querying by author end music', async () => {
    afterEach(setEnvVars);

    const { sut } = makeSut()

    const lyrics = await sut.getLyric('adele', 'hello');
    expect(lyrics).toEqual(`hello it's me`);
  });

  it('should call the function insertLyric', async () => {
    afterEach(setEnvVars);

    const { sut } = makeSut();
    await sut.insertLyric('adele', 'hello', `Hello it's me`);
    expect('oi').toEqual('oi');
    // expect(sut.insertLyric).toHaveBeenCalledWith({});
  });
    
});

