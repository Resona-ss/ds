<template>
    <div>
           <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="addperlogVisible=true">添加角色</el-button>
            </el-col>
        </el-row>
        <!-- 角色列表区域 -->
        <el-table :data="roleList" border stripe>
            <!-- 展开列区域 -->
            <el-table-column type="expand" >
                <template slot-scope="scope">
                    
                   <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']"
                   v-for="(item1,i1) in scope.row.children" :key="item1.id">
                       <!-- 渲染一级权限 -->
                       <el-col :span='5'>
                           <el-tag closable @close="removeRightbyid(scope.row,item3.id)">{{item1.authName}}</el-tag>
                           <i class="el-icon-caret-right"></i>
                       </el-col>
                       <!-- 渲二级和三级权限 -->
                       <el-col :span='19'>
                          <el-row :class="[i2===0?'':'bdtop','vcenter']" 
                          v-for="(item2,i2) in item1.children" :key="item2.id">
                            <el-col :span='6'>
                                    <el-tag type="success" closable @close="removeRightbyid(scope.row,item2.id)"
                                    >{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span='18'>
                                <el-tag closable @close="removeRightbyid(scope.row,item3.id)"
                                type="warning" v-for="item3 in item2.children" :key="item3.id">
                                    {{item3.authName}}
                                </el-tag>
                            </el-col>
                          </el-row>
                       </el-col>
                   </el-row>
                </template>
            </el-table-column>
            <!-- 索引列区域 -->
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="角色名称" prop="roleDesc"></el-table-column>
      <el-table-column label="角色描述" prop="roleName"></el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="editper(scope.row.id)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeuserbyid(scope.row.id)">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="setRightDialog(scope.row)">分配权限</el-button>
          </template>
      </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色功能 -->
    <el-dialog
            title="添加角色"
            :visible.sync="addperlogVisible"
            width="40%" @close="addperFormClosed">
  <el-form :model="addperForm" label-width="80px" ref="addperFormRef">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addperForm.roleDesc"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="addperForm.roleName"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addperlogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addperuser">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑用户数据 -->
<el-dialog
            title="编辑角色"
            :visible.sync="editperlogVisible"
            width="40%" >
  <el-form :model="editperForm" label-width="80px" ref="editperFormRef">
  <el-form-item label="角色名称" prop="roleDesc">
    <el-input v-model="editperForm.roleDesc"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleName">
    <el-input v-model="editperForm.roleName"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editperlogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editperlog">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配权限树状数据 -->
<el-dialog
  title="提示"
  :visible.sync="showRightDialog"
  width="50%" @close="showRightDialogclose">
  <!-- 树状控件 -->
  <el-tree :data="rightsList" :props="treeProps" show-checkbox ref="treeRef"
            node-key="id" default-expand-all :default-checked-keys="defKeys"
  ></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showRightDialog = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            roleList:[],
            //添加角色按钮
            addperlogVisible:false,
            // 编辑角色权限对话框
            editperlogVisible:false,
            //分配权限对话框
            showRightDialog:false,
            //树状角色权限数据
            rightsList:[],
            //默认选中的权限
            defKeys:[],
            //即将上传的权限id
            roleid:'',
            //显示的字段配置
            treeProps:{
                label:'authName',
                children:'children',
                
            },
            //添加角色数据
            addperForm:{
                roleName:'',
                roleDesc:''
            },
            //编辑角色数据
            editperForm:{
                roleName:'',
                roleDesc:''
            },

        }
    },
created() {
    this.getroleList()
},
methods: {
    async getroleList(){
        const {data:res}=await this.$http.get('roles/');
        if(res.meta.status!==200){
          return this.$message.error('获取数据失败')
    }
        this.roleList=res.data;
        //console.log(this.roleList)
    },
    //取消表单时初始化
    addperFormClosed(){
        //console.log( this.$refs.addperFormRef)
        this.$refs.addperFormRef.resetFields()
    },
    //确定表单时事件
    async addperuser(){
        const {data:res}=await this.$http.post('roles',this.addperForm)
        //console.log(res)
        this.addperlogVisible = false
        this.getroleList()
        if(res.meta.status !==201){
            return this.$message.error('添加用户失败')
        }else{
            return this.$message.success('添加用户成功')
        }
        
    },
    //编辑用户
    async editper(id){
        this.editperlogVisible=true
        const {data:res}=await this.$http.get('roles/' + id)
        //console.log(res)
        this.editperForm=res.data
        
    },
    async editperlog(){
        const {data:res}=await this.$http.put('roles/' + this.editperForm.roleId,{
            roleDesc:this.editperForm.roleDesc,
            roleName:this.editperForm.roleName
        })
        
        //console.log(this.editperForm)
        if(res.meta.status !==200){
            return this.$message.error('编辑用户失败')
        }else{
            this.getroleList()
            this.editperlogVisible=false
            return this.$message.success('编辑用户成功')
        }
        
    },
     removeuserbyid(id){
        //console.log(id)
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async ()=>{
            const {data:res}=await this.$http.delete('roles/' + id) 
            //console.log(res.data)  
            if(res.meta.status ==200){
                this.$message.success('删除用户成功')
                this.getroleList()}
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        }) 
    },
    //点击标签删除权限
    removeRightbyid(role,rightid){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async ()=>{
            const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightid}`) 
            //console.log(res.data)  
            if(res.meta.status ==200){
                this.$message.success('删除用户成功')
                //this.getroleList()
                 role.children=res.data
                }  
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        }) 

    },
    //分配权限按钮功能
async setRightDialog(role){
        this.showRightDialog=true
        this.roleid=role.id
        const {data:res}=await this.$http.get('rights/tree')
        //console.log(res.data)
        if(res.meta.status !==200){
            return this.$message.error('分配权限失败')
        }
        this.rightsList=res.data
        //递归获取三级节点的权限id
        this.getLeafkeys(role,this.defKeys)
        
    },
    //定义筛选递归找到权限id
    getLeafkeys(node,arr){
        
        if(!node.children){
            return arr.push(node.id)
        }else{
            node.children.forEach(item=>this.getLeafkeys(item,arr))
        }
        
        
    },
    //初始化权限id
    showRightDialogclose(){
        this.defKeys=[]
    },
    //点击确定提交权限
    async allotRights(){
        const keys=[
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idstr=key.join(',')
        const {data:res}=await this.$http.post(`roles/${this.roleid}/rights`,{rids:idstr})
        if(res.meta.status!==200){
            return this.$message.error('分配权限失败')
        }else{
            this.$message.success('分配权限成功')
            this.getroleList()
            this.showRightDialog = false
        }
    },
    
    
},

}
</script>
<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top:1px solid #eee
}
.bdbottom{
    border-bottom:1px solid #eee ;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>