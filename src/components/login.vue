<template>
    <div class="login_container">
        <div class="login_box">
            <!--图片盒子-->
            <div class="avatar_box">
                <img src="../imgs/logo.png" alt="">
            </div>
            <!-- 表单登录区域 -->
            <el-form :model="loginForm" :rules="Rules" label-width="0px" class="login_form">
                <!-- 昵称输入 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user" placeholder="输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <!-- 密码输入 -->
                    <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-lock_fill" placeholder="输入密码"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary">登录</el-button>
                    <el-button type="info">重置</el-button>
                </el-form-item>
            </el-form>
            
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 登录表单的数据绑定对象
            loginForm:{
                username:'11',
                password:'22'
            },
            Rules: {
                username: [
                  { required: true, message: '请输入登录名称', trigger: 'blur' },
                  { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
          ],
                password: [
                  { required: true, message: '请输入登录密码', trigger: 'blur' },
                  { min: 6, max: 13, message: '长度在 6 到 13 个字符', trigger: 'blur' }
          ],
        }
    }
    
 }
}
</script>
<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 400px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.avatar_box{
    height: 100px;
    width: 100px;
    border:1px solid #666;
    border-radius: 50%;
    padding: 5px;
    box-shadow: 0 0 10px #666;
    box-sizing: border-box;
    position: absolute;
    transform: translate(-50%,-50%);
    left: 50%;
    background-color: azure;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgb(139, 170, 182);
        
    }

}
.btns{
    
    display: flex;
    justify-content: flex-end;
    
    
}
.login_form{
    
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
}



</style>