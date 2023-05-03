<script setup lang="ts">
import { reactive } from 'vue';
import { useGoodsStore } from '../store'
import { sum } from '../utils'

type GoodsList = {
    code: string,
    name: string,
    price: number,
    number: number
}[];

const goodsStore = useGoodsStore();

let inputGoods = reactive<GoodsList>([])
let outputGoods = reactive<GoodsList>([])

function addInputGood(value: any) {
    const code: string = value[1];
    const good = goodsStore.$state.goods.find(good => good.code === code)!;
    inputGoods.push({
        code,
        name: good.cn_name,
        price: good.price,
        number: 1
    })
}

function addOutputGood(value: any) {
    const code: string = value[1];
    const good = goodsStore.$state.goods.find(good => good.code === code)!;
    outputGoods.push({
        code,
        name: good.cn_name,
        price: good.price,
        number: 1
    })
}

function removeInputGood(code: string) {
    let index = inputGoods.findIndex(good => good.code === code);
    inputGoods.splice(index, 1);
}

function removeOutputGood(code: string) {
    let index = outputGoods.findIndex(good => good.code === code);
    outputGoods.splice(index, 1);
}

function totalPrice(goods: GoodsList) {
    return sum(goods.map(good => good.price * good.number))
}

function generateScript(): string {
    return `pm_NAME = {
    texture = "gfx/interface/icons/production_method_icons/NAME.dds"
    
    building_modifiers = {
        workforce_scaled = {
            # input goods
            ${inputGoods.map(good => `building_input_${good.code}_add = ${good.number}`).join('\n            ')}

            # output goods
            ${outputGoods.map(good => `building_input_${good.code}_add = ${good.number}`).join('\n            ')}
        }
    }
}
`
}
</script>

<template>
    <div class="container">
        <div class="left">
            <el-cascader class="cascader" :options="goodsStore.cascadeOptions" placeholder="添加输入商品"
                @change="addInputGood"></el-cascader>
            <div class="list">
                <template v-for="good in inputGoods">
                    <el-text>{{ goodsStore.$state.goods.find(thisGood => thisGood.code === good.code)!.cn_name }}</el-text>
                    <el-input type="number" v-model="good.number"></el-input>
                    <el-button @click="removeInputGood(good.code)">删除</el-button>
                </template>
            </div>
        </div>
        <div class="content">
            <el-descriptions title="计算结果" border :column="1" class="descriptions">
                <el-descriptions-item label="成本">
                    {{ totalPrice(inputGoods) }}</el-descriptions-item>
                <el-descriptions-item label="收入">
                    {{ totalPrice(outputGoods) }}</el-descriptions-item>
                <el-descriptions-item label="利润">
                    {{ (totalPrice(outputGoods) - totalPrice(inputGoods)).toFixed(2) }}
                </el-descriptions-item>
                <el-descriptions-item label="利润率">
                    {{ ((totalPrice(outputGoods) - totalPrice(inputGoods)) / totalPrice(inputGoods) * 100).toFixed(2) }}%
                </el-descriptions-item>
            </el-descriptions>

            <pre class="codeblock">{{ generateScript() }}</pre>
        </div>
        <div class="right">
            <el-cascader class="cascader" :options="goodsStore.cascadeOptions" placeholder="添加输出商品" @change="addOutputGood"></el-cascader>
            <div class="list">
                <template v-for="good in outputGoods">
                    <el-text>{{ goodsStore.$state.goods.find(thisGood => thisGood.code === good.code)!.cn_name }}</el-text>
                    <el-input type="number" v-model="good.number"></el-input>
                    <el-button @click="removeOutputGood(good.code)">删除</el-button>
                </template>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.container {
    display: grid;
    grid-template-columns: auto 1fr auto;
}

.content {
    display: flex;
    align-items: center;
    flex-direction: column;

    .codeblock {
        background-color: #eeeeee;
        padding: 18px;
        border-radius: 16px;
    }
}

.content:deep(.descriptions) {
    width: 280px
}

.left:deep(.cascader),
.right:deep(.cascader) {
    width: 280px
}

.left>.list,
.right>.list {
    margin-top: 8px;
    display: grid;
    grid-template-columns: 110px 100px auto;
}
</style>

