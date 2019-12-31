<template>
  <div class="app-container aboutus">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 800px;"
        class="aboutformus"
      >  
        <el-form-item label="公司logo" class="aboutbtn">
          <el-input v-model="temp.logo_id" type="hidden" />
          <pan-thumb :image="temp.logo_url" />
          <el-button
            type="primary"
            icon="upload"
            style="position: absolute;bottom: 70px;margin-left: 40px;"
            @click="imagecropperShow=true"
          >上传logo</el-button>

          <image-cropper
            v-show="imagecropperShow"
            :key="imagecropperKey"
            :width="100"
            :height="100"
            :url="upload_url"
            field="file"
            lang-type="zh"
            @close="close"
            @crop-upload-success="cropSuccesslogo"
          />
        </el-form-item>      
        <el-form-item label="微信公众号" class="aboutbtn">
          <el-input v-model="temp.wechat_code_id" type="hidden" />
          <pan-thumb :image="temp.wechat_code_url" />
          <el-button
            type="primary"
            icon="upload"
            style="position: absolute;bottom: 70px;margin-left: 40px;"
            @click="imagecropperShow1=true"
          >上传二维码图片</el-button>

          <image-cropper
            v-show="imagecropperShow1"
            :key="imagecropperKey1"
            :width="100"
            :height="100"
            :url="upload_url"
            field="file"
            lang-type="zh"
            @close="close"
            @crop-upload-success="cropSuccesswechart"
          />
        </el-form-item>  
        
        <el-form-item label="公司名字" prop="company_name">
          <el-input v-model="temp.company_name" placeholder="请输入公司名字" style="width:180px;" />
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="temp.address" placeholder="请输入公司地址" style="width:180px;" />
        </el-form-item>
        <el-form-item label="电话号码" prop="tel">
          <el-input v-model="temp.tel"  placeholder="请输入电话号码" style="width:180px;" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="temp.phone"  placeholder="请输入手机号码" style="width:180px;" />
        </el-form-item>
        <el-form-item label="备案号" prop="beian_num" placeholder="请输入备案号">
          <el-input v-model="temp.beian_num " style="width:180px;"  />
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="temp.qq"  placeholder="请输入QQ" style="width:180px;" />
        </el-form-item>
        <el-form-item label="微信" prop="wechat">
          <el-input v-model="temp.wechat"  placeholder="请输入微信" style="width:180px;" />
        </el-form-item>
        <el-form-item label="邮政编码" prop="postcode">
          <el-input v-model="temp.postcode"  placeholder="请输入邮政编码" style="width:180px;" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email "  placeholder="请输入邮箱" style="width:180px;" />
        </el-form-item>
        <el-form-item label="关键词" prop="keyword">
          <el-input v-model="temp.keyword"  placeholder="请输入关键词" style="width:180px;" />
        </el-form-item>
        <el-form-item label="公司描述" prop="description">
          <el-input 
          type="textarea" 
          v-model="temp.description"  
          placeholder="请输入公司描述" 
          :rows="6"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer aboutfooter">
        <el-button @click="getaboutus()">重置</el-button>
        <el-button type="primary" @click="updateData()">确定</el-button>
      </div>
   
  </div>
</template>

<script>
import { getAbout, postAbout } from '@/api/about'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  name: 'getAbout',
  components: { ImageCropper, PanThumb, Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      username_disabled: false,
      role_plist: null,
      temp: {
        id: undefined,
        logo_id: '',
        logo_url: '',
        wechat_code_id: '',
        wechat_code_url: ''
      },
      dialogFormVisible: false,
      dialogEsc: false,
      rules: {
        address:[
          { required: true, message: '公司地址为必填项', trigger: 'blur' }
        ],
        company_name: [
          { required: true, message: '公司名字为必填项', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机为必填项', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '电话为必填项', trigger: 'blur' }
        ],
        qq: [
          { required: true, message: 'QQ为必填项', trigger: 'blur' }
        ],
        wechat: [
          { required: true, message: '微信为必填项', trigger: 'blur' }
        ],
        beian_num:[
          { required: true, message: '备案号为必填项', trigger: 'blur' }
        ],
        postcode:[
          { required: true, message: '邮政编码为必填项', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '邮箱为必填项', trigger: 'blur' }
        ],
        keyword:[
          { required: true, message: '关键词为必填项', trigger: 'blur' }
        ],       
        description:[
          { required: true, message: '描述为必填项', trigger: 'blur' }
        ],   

        realname: [
          { required: true, message: '真实姓名为必填项', trigger: 'blur' }
        ]
      },
      imagecropperShow: false,
      imagecropperKey: 0,
      imagecropperShow1: false,
      imagecropperKey1: 0,
      upload_url: process.env.VUE_APP_BASE_API + '/api/file'
    }
  },
  created() {
    this.getaboutus()
  },
  methods: {
    cropSuccesslogo(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.temp.logo_url = resData.url
      this.temp.logo_id = resData.id
    },
    cropSuccesswechart(resData){
      this.imagecropperShow1 = false
      this.imagecropperKey1 = this.imagecropperKey1 + 1
      this.temp.wechat_code_url = resData.url
      this.temp.wechat_code_id = resData.id 
    },
    close() {
      this.imagecropperShow = false
      this.imagecropperShow1 = false
    },
    getaboutus() {
      this.listLoading = true
      getAbout().then(response => {
        this.temp = response.data
        console.log(this.temp)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.username_disabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          console.log(this.temp)
          const tempData = Object.assign({}, this.temp)
          postAbout(tempData).then(response => {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
.aboutbtn.el-form-item--mini label{
  line-height: 150px;
}
.aboutbtn .el-form-item__content{
  margin-top: -20px;
}
.aboutfooter{text-align: center;}
.aboutformus{  margin: 0 auto;}
</style>
