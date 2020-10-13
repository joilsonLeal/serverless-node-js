export interface LyrifyRepositoryInterface {
    getLyric: (author: string, music: string) => Promise<string>
    insertLyric: (author: string, music: string, lyric: string) => Promise<void>
}