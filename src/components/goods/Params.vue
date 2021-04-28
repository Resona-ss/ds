<template>
    <div>
            <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb> 
    <!-- 卡片视图区 -->
    <el-card>
        <!-- 警告区 -->
        <el-alert
            title="警告提示的文案" :closable="false" show-icon
            type="warning">
        </el-alert>
    <!-- 选择商品分类 -->
    <el-row class="cat_opt">
        <el-col>
            <span>选择商品分类：</span>
            <!-- 选择商品分类的级联选择框 -->
        </el-col>
    </el-row>
    </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    created() {
        this.getcatelist()
    },
    methods: {
        async getcatelist(){
            const {data:res}=await this.$http.get('categories')
            console.log(res)
        },
    },
}
</script>
<style lang="less" scoped>
.cat_opt{
    margin:15px 0;
}
</style>