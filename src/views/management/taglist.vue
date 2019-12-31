<template>
  <div class="app-container">
    <div class="filter-container">
       <el-input
        v-model="addtag.tag_name"
        clearable
        style="width: 200px;"
        class="filter-item"
        placeholder="输入新增标签名字"
        />  
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="createData"
      >新增标签</el-button>
 </div>
 
 <div class="tagcont">
    <el-tag
  :key="tag.id"
  v-for="tag in list"
  closable
  :disable-transitions="false"
  @close="deletag(tag.id)" class="taglist">
  {{tag.tag_name}}
</el-tag>
    </div>

  </div>
</template>

<script>
import { getTagList, postTag, deleteTag} from '@/api/about'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

const statusOptions = [
  { key: '0', display_name: '禁用' },
  { key: '1', display_name: '启用' }
]

export default {
  name: 'Admin',
  components: { ImageCropper, PanThumb, Pagination },
  directives: { waves },
  data() {
    return {
      addtag:{
      tag_name:'',
      },
      inputValue: '',
      list: null,
      rules: {
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    deletag(id){
        let deledata={
            id
        }
        deleteTag(deledata).then(response=>{
               this.$notify({
                title: '删除',
                message: '删除成功',
                type: 'success',
                duration: 2000
                })
                this.getList()

        })

    },
    getList() {
      this.listLoading = true
      getTagList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    createData() {
        if(this.addtag.tag_name!==""){
            console.log(this.addtag.tag_name)
            postTag(this.addtag).then(response=>{
                console.log(response)
                this.getList()
                this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
                })
            })
        }else{
               this.$notify({
                title: '错误',
                message: '标签名字不能为空',
                type: 'error',
                duration: 2000
                }) 
        }
    },

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-tagbox.el-tag {
  margin-left: 10px;
}
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    padding: 20px 30rpx;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .tagcont{
  border: 1px solid #EBEEF5;
  padding: 25px 0 25px 25px;
  border-radius: 4px;}
  .taglist{
      padding: 20px 30rpx;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      font-size: 14px; 
      margin-bottom: 20px;
      margin-right: 20px;
      }
.el-tag .el-icon-close::before{
    transform: scale(1);
    width: 18px;
    height: 18px;
}
</style>
