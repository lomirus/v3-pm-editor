import { defineStore } from 'pinia'
import { Good } from '../types'

export const useGoodsStore = defineStore('goods', {
    state: () => ({
        goods: [] as Good[]
    }),
    getters: {
        cascadeOptions(state) {
            let categoriesMap = new Map<string, Good[]>();
            for (let i = 0; i < state.goods.length; i++) {
                const good = state.goods[i]
                if (categoriesMap.has(good.category)) {
                    categoriesMap.get(good.category)!.push(good)
                } else {
                    categoriesMap.set(good.category, [good])
                }
            }
            const options = [];
            for (const key of categoriesMap.keys()) {
                options.push({
                    value: key,
                    label: key,
                    children: categoriesMap.get(key)!.map(good => ({
                        value: good.code,
                        label: good.cn_name
                    }))
                })
            }
            return options
        }
    }
})