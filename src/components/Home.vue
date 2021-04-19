<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
  <el-header><div>
      <img src="../assets/heima.png" alt="">
      <span>电商管理系统</span>
  </div>
      <el-button type="info" @click="logout">退出</el-button></el-header>
  <el-container>
      <!-- 侧面区域 -->
    <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="togglecollapse">|||</div>
        <!-- 侧面菜单 -->
        <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff"
      :unique-opened="true" router
      :collapse="iscollapse" :collapse-transition="false"
      :default-active="activePath"
      >
      
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <i :class="iconsobj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/' + subitem.path + ''" 
        v-for="subitem in item.children" :key="subitem.id"
        @click="saveNvaState('/' + subitem.path)"
        >
          <i class="el-icon-menu"></i>
          <span>{{subitem.authName}}</span></el-menu-item>
      </el-submenu>
      
    </el-menu>
    </el-aside>
    <!-- 主要区域 -->
    <el-main>
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
        
    
</template>
<script>
export default {
    data(){
        return{
            menulist:[],
            iconsobj:{
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao',
                
            },
            //是否折叠
            iscollapse:false,
            //被激活的路径高亮
            activePath:'',

        }
    },
    created() {
        this.getMenuList()
        this.activePath=window.sessionStorage.getItem('activepath')
    },
    components:{

    },
    methods: {
        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login")
        },
        //获取菜单数据
        async getMenuList(){
            const{data:res}=await this.$http.get('menus')
            if(res.meta.status !==200){
                return this.$message.error('获取菜单失败')
            }else{
                this.menulist=res.data
            }
            console.log(res)
        },
        //点击菜单缩放
        togglecollapse(){
            this.iscollapse= !this.iscollapse
        },
        saveNvaState(activepath){
            window.sessionStorage.setItem('activepath',activepath)
            this.activePath=activepath
        },
    },
}
</script>
<style lang="less" scoped>
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: rgb(226, 217, 217);
    font-size: 20px;
    > div{
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;
        }

    }
}
.el-aside{
    background-color: #333744;
    .el-menu{
        border: 0px;
    }
}
.el-main{
    background-color: #eaedf1;
}
.home-container{
    height: 100%;
}
.iconfont{
    margin-right: 5px;
}
.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    letter-spacing: 0.2em;
}

</style>