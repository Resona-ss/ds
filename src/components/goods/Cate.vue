<template>
    <div>
          <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="addgoodsbtn">添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 分类表格 -->
        <tree-table class="treeb" :data="catelist" :columns="columns" :selection-type="false" 
            :expand-type="false" show-index index-text="#" border>
            <template slot="isok" slot-scope="scope">
                <i class="el-icon-success"
                v-if="scope.row.cat_deleted===false"
                style="color:lightgreen"></i>
                <i class="el-icon-error" v-else
                style="color:red"></i>
            </template>
            <!-- 排序列 -->
            <template slot="order" slot-scope="scope"> 
                <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                <el-tag type="warning" size="mini" v-else>三级</el-tag>
            </template>
            <!-- 操作列 -->
            <template slot="opt" slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit"
                size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete"
                size="mini" @click="deletecate(scope.row)">删除</el-button>
            </template>
        </tree-table>
        <!-- 分页区域 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
  title="提示"
  :visible.sync="adddialogVisible"
  width="50%" @close="addcatedialogclose"
  >
  <!-- 表单分类 -->
  <el-form :model="addcateForm" :rules="addcataerules" ref="addcateFormref" label-width="100px">
    <el-form-item label="分类名称：" prop="cat_name">
        <el-input v-model="addcateForm.cat_name"></el-input>
    </el-form-item>
    <!-- 父级权限选择框 options指定绑定的数据 props指定配置的对象数据-->
    <el-form-item label="父级分类：">
    <el-cascader
        class="cascader" v-model="selectKeys" :clearable="true"
        :options="parentcatelist" :props="cascaderProps"
        @change="parentCatechanged"></el-cascader>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="adddcate">确 定</el-button>
  </span>
</el-dialog>
<!-- 删除商品分类对话框 -->
<el-dialog
  title="提示"
  :visible.sync="deletedialogVisible"
  width="50%"
  >
  <el-form>
  <el-form-item label="活动名称">
    <el-input v-model="deletecatename"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="deletedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="deletecatedialog">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //查询参数
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            //商品分类的列表数据
            catelist:[],
            //总数据条数
            total:0,
            //添加分类对话框开关
            adddialogVisible:false,
            //分类表单验证数据
            addcateForm:{
                //将要添加的分类名称
                cat_name:'',
                //父级分类的id
                cat_pid:0,
                //分类等级，默认1级
                cat_level:0

            },
            //分类表单验证规则
            addcataerules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ]
            },
            //父级权限数据
            parentcatelist:[],
            //指定父级权限的级联选择器配置对象参数
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger:"hover",
                //是否可以选择父级
                checkStrictly:"true"
            },
            //选中的父级分类id数组
            selectKeys:[],
            //为table指定列的参数
            columns:[
                {
                label:'分类名称',
                prop:'cat_name'
            },
            {   //当前列标题
                label:'是否有效',
                //当前列类型是子组件的模板
                type:'template',
                //当前模板的名称（id）
                template:'isok'
            },
            {   //当前列标题
                label:'排序',
                //当前列类型是子组件的模板
                type:'template',
                //当前模板的名称（id）
                template:'order'
            },
            {   //当前列标题
                label:'操作',
                //当前列类型是子组件的模板
                type:'template',
                //当前模板的名称（id）
                template:'opt'
            },
            ],
            //删除商品分类按钮
            deletedialogVisible:false,
            //即将删除的商品名称
            deletecatename:'',
            deletecateid:'',

        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList(){
            const {data:res}=await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status !==200){
                return this.$message.console.error('获取商品列表失败');
            }
            //console.log(res.data)
            this.catelist=res.data.result
            this.total=res.data.total
        },
        //监听每页条数改变
        handleSizeChange(size){
            this.queryInfo.pagesize=size
            this.getCateList()
        },
        //监听当前页码改变
        handleCurrentChange(current){
            this.queryInfo.pagenum=current
            this.getCateList()
        },
        //添加分类按钮
        addgoodsbtn(){
           this.adddialogVisible=true
           this.getParntcatelist()

        },
        //获取父级分类权限数据
        async getParntcatelist(){
            const {data:res}=await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status !==200){
                return this.$message.error('获取父级分类数据失败')
            }
            //console.log(res.data)
            this.parentcatelist=res.data
        },
        //权限选择项改变时，触发这个判断权限等级函数
        parentCatechanged(){
            //console.log(this.selectKeys)
            if(this.selectKeys.length>0){
                //父级分类的id
                this.addcateForm.cat_pid=this.selectKeys[this.selectKeys.length-1]
                //当前分类的等级赋值
                this.addcateForm.cat_level=this.selectKeys.length
                return
            }else{
                this.addcateForm.cat_pid=0
                this.addcateForm.cat_level=0
            }
        },
        //点击确实时添加新的分类
        adddcate(){
            //console.log(this.addcateForm)
            
            this.$refs.addcateFormref.validate(async valid=>{
                if(!valid) return
                const {data:res}= await this.$http.post('categories',this.addcateForm)
                
                if(res.meta.status !==201){
                    return this.$message.error('添加分类失败')
                }
                this.getCateList()
                this.$message.success('添加分类成功')
                console.log(res.data)
                this.adddialogVisible = false
            })

        },
        //添加分类表单关闭事件
        addcatedialogclose(){
            this.$refs.addcateFormref.resetFields()
            this.selectKeys=[]
            this.addcateForm.cat_level=0
            this.addcateForm.cat_pid=0
            
        },
        //删除商品分类按钮
        deletecate(id){
            this.deletedialogVisible=true
            //console.log(id)
            this.deletecatename=id.cat_name
            this.deletecateid=id.cat_id
            //console.log(this.deletecateid)
        },
        async deletecatedialog(){
            const {data:res}=await this.$http.delete('categories/' + this.deletecateid)
            console.log(res)
            if(res.meta.status !==200){
                return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.getCateList()
            this.deletedialogVisible = false
        },
    },
}
</script>
<style lang="less" scoped>
.treeb{
    margin-top: 15px;
}
.cascader{
    width: 100%;
}
.el-input{
    width: 400px;
}

</style>