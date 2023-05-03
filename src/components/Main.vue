<script setup lang="ts">
import { reactive } from 'vue';
import { writeText } from '@tauri-apps/api/clipboard';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { ElMessage } from 'element-plus'
import { usePmStore } from '../store'
import { sum } from '../utils'

type GoodsList = {
    code: string,
    name: string,
    price: number,
    number: number
}[];

const pmStore = usePmStore();

let inputGoods = reactive<GoodsList>([])
let outputGoods = reactive<GoodsList>([])

function addInputGood(value: any) {
    const code: string = value[1];
    const good = pmStore.$state.goods.find(good => good.code === code)!;
    inputGoods.push({
        code,
        name: good.cn_name,
        price: good.price,
        number: 1
    })
}

function addOutputGood(value: any) {
    const code: string = value[1];
    const good = pmStore.$state.goods.find(good => good.code === code)!;
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
    return `pm_${pmStore.pm} = {
    texture = "gfx/interface/icons/production_method_icons/${pmStore.pm}.dds"
    
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

async function handleCodegenClick() {
    await writeText(generateScript())
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
        sendNotification('已复制至剪贴板');
    }
}
</script>

<template>
    <div class="container">
        <div class="left">
            <el-cascader class="cascader" :options="pmStore.cascadeOptions" placeholder="添加输入商品"
                @change="addInputGood"></el-cascader>
            <div class="list">
                <template v-for="good in inputGoods">
                    <el-text>{{ pmStore.$state.goods.find(thisGood => thisGood.code === good.code)!.cn_name }}</el-text>
                    <el-input class="input" type="number" v-model="good.number">
                        <template #prepend>{{ good.price }} ×</template>
                        <template #append>
                            = {{ good.price * good.number }}
                            ({{ (good.price * good.number / totalPrice(inputGoods) * 100).toFixed(1) }}%)
                        </template>
                    </el-input>
                    <el-button class="delete" @click="removeInputGood(good.code)">删除</el-button>
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
            <div class="pm-name">
                PM标识代码：<el-input class="input" placeholder="生产方式标识代码" v-model="pmStore.$state.pm">
                    <template #prepend>pm_</template>
                </el-input>
            </div>


            <el-button class="codegen-button" @click="handleCodegenClick">生成代码并复制</el-button>
        </div>
        <div class="right">
            <el-cascader class="cascader" :options="pmStore.cascadeOptions" placeholder="添加输出商品"
                @change="addOutputGood"></el-cascader>
            <div class="list">
                <template v-for="good in outputGoods">
                    <el-text>{{ pmStore.$state.goods.find(thisGood => thisGood.code === good.code)!.cn_name }}</el-text>
                    <el-input class="input" type="number" v-model="good.number">
                        <template #prepend>{{ good.price }} ×</template>
                        <template #append>
                            = {{ good.price * good.number }}
                            ({{ (good.price * good.number / totalPrice(outputGoods) * 100).toFixed(1) }}%)
                        </template>
                    </el-input>
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

    .descriptions {
        width: 280px
    }

    .pm-name {
        margin-top: 18px;
        display: flex;

        .input {
            width: 200px;
        }
    }

    .codegen-button {
        margin-top: 18px;
    }
}


.left:deep(.cascader),
.right:deep(.cascader) {
    width: 420px;

    .delete {
        width: 20px
    }
}

.left>.list,
.right>.list {
    margin-top: 8px;
    display: grid;
    width: 420px;
    grid-template-columns: 110px auto 60px;

    .input {
        display: grid;
        grid-template-columns: 60px 1fr 120px;

    }

    &:deep(.el-input-group__prepend) {
        padding: 0;
        ;
    }

    &:deep(.el-input-group__append) {
        padding: 0;
        ;
    }
}</style>

