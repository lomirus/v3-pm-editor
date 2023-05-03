import * as XLSX from "xlsx"

import { RawGoodRow, Good } from '../types'

export async function selectFile(): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const fileSelector = document.createElement('input');
        fileSelector.type = 'file'

        fileSelector.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files![0];

            const reader = new FileReader();
            reader.readAsArrayBuffer(file)
            reader.onload = () => {
                resolve(reader.result as ArrayBuffer)
            }
            reader.onerror = () => {
                reject(reader.result as ArrayBuffer)
            }
        }

        fileSelector.click();
    })
}

export function parseGoodsSheet(file: ArrayBuffer): Good[] {
    const workbook = XLSX.read(file);
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rawJson = XLSX.utils.sheet_to_json(sheet) as RawGoodRow[];
    const finalJson = [];
    let thisCategory = rawJson[0]["分类"]!;
    for (let i = 0; i < rawJson.length; i++) {
        if (rawJson[i]["分类"]) {
            thisCategory = rawJson[i]["分类"]!;
        }
        finalJson.push({
            category: thisCategory,
            cn_name: rawJson[i]["商品名"],
            en_name: rawJson[i]["英文名"],
            code: rawJson[i]["标识符"],
            description: rawJson[i]["注释"],
            price: rawJson[i]["价格（除以10w）"],
            prestige: rawJson[i]["威望系数"],
        })
    }
    return finalJson
}

export function sum(array: number[]): number {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i]
    }
    return sum;
}