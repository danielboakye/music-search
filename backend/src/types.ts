export interface IProcessedTracks {
    id: number
    artist: string
    picture: string
    duration: string
    album: string
}

export interface IAlbum {
    picture: string
    name: string
    releaseYear: string
}

interface ITopTracks {
    title: string
    duration: string
}

export interface IProcessedArtist {
    name: string
    picture: string
    fans: number
    topTracks: ITopTracks[]
    albums?: IAlbum[]
}