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

  afterEach(setEnvVars);

  it('should return lyrics when querying by author end music', async () => {
    const { sut } = makeSut()

    const lyrics = await sut.getLyric('adele', 'hello');
    expect(lyrics).toEqual(`hello it's me`);
  });
  afterEach(setEnvVars);
  it('should insert new author, music and lyrics', async () => {
    const { sut } = makeSut()

    await sut.insertLyric('adele', 'hello', `Hello it's me`);

    // expect(sut.insertLyric).toHaveBeenCalledWith({TableName: 'lyrics', Item: { author: 'adele', music: 'hello', lyrics: `Hello it's me`}})
  });
    
});

