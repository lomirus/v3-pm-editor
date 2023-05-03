export type RawGoodRow = {
    "交易单位（手）": string
    "价格（除以10w）": number
    "分类"?: string
    "单位价格（元）": number
    "商品名": string
    "图标描述": string
    "威望系数": number
    "标识符": string
    "每单位重量": string
    "注释": string
    "用途描述": string
    "英文名": string
}

export type Good = {
    category: string,
    cn_name: string,
    en_name: string,
    code: string,
    description: string,
    price: number,
    prestige: number,
}