<script setup lang="ts">
import { parseGoodsSheet, selectFile } from '../utils'
import { usePmStore } from '../store'

const pmStore = usePmStore();

async function handleImport() {
  const file = await selectFile()
  pmStore.$patch({
    goods: parseGoodsSheet(file)
  })
}

</script>

<template>
  <header>
    <el-button @click="handleImport">导入商品表</el-button>
    <el-text class="import-state">{{ pmStore.$state.goods.length === 0 ?
      '未导入' :
      `已导入${pmStore.$state.goods.length}种商品`
    }}</el-text>
  </header>
</template>

<style scoped lang="less">
header {
  margin-bottom: 16px;
}
.import-state {
  margin-left: 8px;
}
</style>

