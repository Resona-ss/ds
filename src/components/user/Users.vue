<template>
    <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
  <!-- //卡片视图区 -->
  <el-card >
  <!-- 搜索框 -->
  <el-row :gutter="20">
      <el-col :span="8">
    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable 
        @clear="getUserList" @change="getUserList">
    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
  </el-input>
  </el-col>
  <el-col :span="4">
      <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
      </el-col>  
  </el-row>
  <!-- 用户列表区域 -->
  <el-table :data="userlist" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态" >
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
      </el-table-column>
      <el-table-column label="操作" :enterable="false" >
          <template slot-scope="scope">
            
                  <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  @click="showEditDialog(scope.row.id)"
                ></el-button>
                  <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" 
                size="mini" @click="removeUserById(scope.row.id)"></el-button>
                   <!-- 分配角色 -->
              <el-tooltip effect="dark" content="分配角色" placement="top">
                 <el-button type="warning" icon="el-icon-setting"
                 @click="setusers(scope.row)" size="mini"></el-button>
              </el-tooltip> 
              
          </template>
      </el-table-column>   
  </el-table>
  <!-- 分页区域 -->
  <div class="block">
    
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 4, 8]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
  </el-card>
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="40%" @close="addDialogClose">
            <!-- 对话框内容 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" 
            label-width="70px" >
            <!-- 用户名 -->
            <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
            </el-form>
            <!-- 对话框底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="40%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" 
            ref="editFormRef" label-width="80px" >
            <el-form-item label="用户名" >
            <el-input v-model="editForm.username" disabled></el-input>
             </el-form-item>
             <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" ></el-input>
             </el-form-item>
             <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile" ></el-input>
             </el-form-item>
             
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog
            title="提示"
            :visible.sync="setUserdialog"
            width="50%" @close="setRoleClose">
            <div>
                <p>当前用户：{{userInfo.username}}</p>
                <p>当前角色：{{userInfo.role_name}}</p>
                <p>分配新角色：
                    <el-select v-model="selectRoleId" placeholder="请选择">
                        <el-option
                        v-for="item in rolesList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setUserdialog = false">取 消</el-button>
                <el-button type="primary" @click="savesetUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        // 验证邮箱规则
        var checkEmail=(rule,value,cb)=>{
            const regEmail= /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if(regEmail.test(value)){
                return cb()
            }else{
                return cb(new Error('请输入合法邮箱'))
            }
        }
        // 验证手机号规则
        var checkMobile=(rule,value,cb)=>{
            const regMobile=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            if(regMobile.test(value)){
                return cb()
            }else{
                cb(new Error('请输入合法手机号'))
            }

        }
        return{
            queryInfo:{
            query:'',
            pagenum:1,
            pagesize:2,
            },
            userlist:[],
            total:0,
            // 控制“添加用户”功能的对话框的显示与隐藏
            addDialogVisible:false,
            // 添加用户表单验证
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:'',
            },
            //分配角色对话框开关
            setUserdialog:false,
            // 需要被分配的角色信息
            userInfo:{},
            //获取当前的角色信息
            rolesList:[],
            //已经分配的角色id
            selectRoleId:' ',
            addFormRules:{
                username: [
                  { required: true, message: '请输入用户名', trigger: 'blur' },
                  { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
                password: [
                  { required: true, message: '请输入密码', trigger: 'blur' },
                  { min: 6, max: 13, message: '长度在 6 到 13 个字符', trigger: 'blur' }
          ],
                email: [
                  { required: true, message: '请输入邮箱', trigger: 'blur' },
                  {validator: checkEmail, trigger:'blur'}
          ],
                mobile: [
                  { required: true, message: '请输入手机号码', trigger: 'blur' },
                  {validator: checkMobile, trigger:'blur'}
          ],
            },
            // 控制修改用户对话框显示与隐藏
            editDialogVisible:false,
            // 用户查询到的信息
            editForm:{},
            editFormRules:{
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {validator:checkEmail,trigger:'blur'}
                ],
                 mobile:[
                    { required: true, message: '请输入手机', trigger: 'blur' },
                    {validator:checkMobile,trigger:'blur'}
                ],

            },



            
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList(){
            
            const {data:res}=await this.$http.get('users',{params:this.queryInfo});
            if(res.meta.status !==200){
                return this.$message.error('用户获取列表失败')
            };
            this.userlist=res.data.users
            this.total=res.data.total
            //console.log(res)

        },
        //监听页数
        handleSizeChange(newsize){
            this.queryInfo.pagesize=newsize;
            this.getUserList()
        },
        handleCurrentChange(newpage){
            this.queryInfo.pagenum=newpage;
            this.getUserList()
        },
        //监听状态开关
        async userStateChange(userinfo){
            console.log(userinfo);
            const {data:res}=await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
            if(res.meta.status !==200){
                userinfo.ma_state = !userinfo.ma_state
                return this.$message.error("更新用户数据失败")
            }else{
                return this.$message.success("更新用户数据成功")
            }
        },
        // 监听对话框关闭事件
        addDialogClose(){
            this.$refs.addFormRef.resetFields()
        },
        // 对话框确定事件
        addUser(){
            this.$refs.addFormRef.validate(async valid=>{
                //console.log(valid)
                if(!valid){return};
                    //可以添加用户表单请求
                   
                const {data:res}= await this.$http.post('users',this.addForm)
                
                if(res.meta.status !==201){
                    this.$message.error('添加用户数据失败')
                }else{
                    this.$message.success('添加用户数据成功');
                    //成功添加时关闭对话框
                    this.addDialogVisible=false
                    //成功后刷新新的用户列表
                    this.getUserList()
                }
            })
        },
        async showEditDialog(id){
            //console.log(id)
            const {data:res}= await this.$http.get('users/' + id)
            if(res.meta.status !==200){
                return this.$message.error('查询用户数据失败')
            }

            this.editForm=res.data
            //console.log(this.editForm)
            this.editDialogVisible=true
        },
        // 监听修改用户对话框的关闭事件
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        // 修改用户信息并提交
        
        editUserInfo(){
            this.$refs.editFormRef.validate(async vaild=>{
                //console.log(vaild)
                if(!vaild) return
                const {data:res}=await this.$http.put('users/' + this.editForm.id,{
                    email:this.editForm.email,
                    mobile:this.editForm.mobile
                })
                if(res.meta.status !==200){
                    return this.$message.error('更新用户信息失败')
                }
                //关闭对话框
                this.editDialogVisible=false
                //刷新列表数据
                this.getUserList()
                //提示修改成功
                this.$message.success('更新用户信息成功')
            })
        },
        //根据id删除用户信息
        async removeUserById(id){
          const confirmResult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        // 验证输出值是否是“confirm”
        if(confirmResult !=='confirm'){
            return this.$message.info('已取消删除')
        }
          const {data:res}= await this.$http.delete('users/' + id)
            if(res.meta.status !==200){
                return this.$message.error('删除用户失败')
            }
            this.$message.success('删除用户成功')
            
            this.getUserList()

        },
        //分配角色按钮
        async setusers(userInfo){
            this.userInfo=userInfo
            this.setUserdialog=true
            const {data:res}=await this.$http.get('roles')  
            if(res.meta.status !==200){
                return this.$message.error('获取角色列表失败')
            }
            this.$message.success('获取角色信息成功')
            this.rolesList=res.data
            
            
        },
        //提交分配的角色信息
        async savesetUser(){
            if(!this.selectRoleId){
                return this.$message.error('请选择要分配的角色')
            }
            const {data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{
                rid:this.selectRoleId
            })
            if(res.meta.status !==200){
                return this.$message.error('更新角色列表失败')
            }
            this.$message.success('更新角色信息成功')
            this.getUserList()
            this.setUserdialog = false

        },
        setRoleClose(){
            this.selectRoleId=''
            this.userInfo={}

        },

    },
}
</script>
<style lang="less" scoped>

</style>