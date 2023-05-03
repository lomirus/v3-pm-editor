<script setup lang="ts">
import { parseGoodsSheet, selectFile } from '../utils'
import { useGoodsStore } from '../store'

const goodsStore = useGoodsStore();

async function handleImport() {
  const file = await selectFile()
  goodsStore.$patch({
    goods: parseGoodsSheet(file)
  })
}

</script>

<template>
  <header>
    <el-button @click="handleImport">导入商品表</el-button>
    <el-text class="import-state">{{ goodsStore.$state.goods.length === 0 ?
      '未导入' :
      `已导入${goodsStore.$state.goods.length}种商品`
    }}</el-text>
  </header>
</template>

<style scoped>
header {
  margin-bottom: 16px;
}
.import-state {
  margin-left: 8px;
}
</style>

