import AwsFactory from '../factories/AwsFactory';
import LyricRepository from './LyricRepository';
const data = require('../mocks/lyrics.json');

const setEnvVars = () => {
  process.env.AWS_DYNAMO_REGION = 'fake_AWS_DYNAMO_REGION'
}
jest.mock('./LyricRepository');

const makeMocks = () => {
  const awsFactory = new AwsFactory();
  return awsFactory;
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
  beforeEach(setEnvVars);
  afterEach(jest.resetAllMocks);

  it('should return a new instance', () => {
    const { sut } = makeSut()

    expect(sut).toBeInstanceOf(LyricRepository)
  });

  it('should throw when no AWS_DYNAMO_REGION env var provided', () => {
    delete process.env.AWS_DYNAMO_REGION

    expect(makeSut).toThrowError('Missing AWS_DYNAMO_REGION environment var')
  });


  it('should return lyrics when querying by author end music', async () => {

    const { sut } = makeSut()

    sut.getLyric = jest.fn().mockImplementation(async () => {
      return Promise.resolve(`Hello, it's me`)
    });

    const lyrics = await sut.getLyric('adele', 'hello');
    expect(sut.getLyric).toHaveBeenCalledTimes(1);
  });

  it('should insert new register when passing new author, music and lyrics', async () => {

    const { sut } = makeSut();

    sut.insertLyric = jest.fn().mockImplementation(() => {
      return Promise.resolve(data)
    });

    await sut.insertLyric('adele', 'hello', `Hello, it's me`);
    expect(sut.insertLyric).toHaveBeenCalledTimes(1);
    expect(sut.insertLyric).toHaveBeenCalledWith(
      'adele',
      'hello',
      'Hello, it\'s me'
    )
  });

});

