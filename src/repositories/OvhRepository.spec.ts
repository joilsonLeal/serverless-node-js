import OvhRepository from './OvhRepository';
jest.mock('node-fetch');
const ovh = new OvhRepository();

test('should call lyrics.ovh api', async () => {
    const author = 'adele';
    const music = 'daydreamer';
    ovh.getLyrics(author, music);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`https://api.lyrics.ovh/v1/${author}/${music}`);
});