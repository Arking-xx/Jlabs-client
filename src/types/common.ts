export type GeoInfo = {
    ip: string
    city: string
    region: string
    country: string
    org: string
    timezone: string
}

export type HistoryItem = {
    id: number
    ip: string
    result: GeoInfo
    createdAt: string
}