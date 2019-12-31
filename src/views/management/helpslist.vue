<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >新增</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="id" prop="id" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" width="650">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
        <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-press-escape="dialogEsc"
      :close-on-click-modal="dialogEsc"
      width
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 600px; margin-left:50px;"
        class="formActivity formcontent"
      >
          <el-form-item label="缩略图" class="aboutbtn">
          <el-input v-model="temp.thumbnail_id" type="hidden" />
          <pan-thumb :image="temp.thumbnail_url" />
          <el-button
            type="primary"
            icon="upload"
            style="position: absolute;bottom: 70px;margin-left: 40px;"
            @click="imagecropperShow=true"
          >上传封面缩略图</el-button>

          <image-cropper
            v-show="imagecropperShow"
            :key="imagecropperKey"
            :width="100"
            :height="100"
            :url="upload_url"
            field="file"
            lang-type="zh"
            @close="close"
            @crop-upload-success="cropSuccess"
          />
        </el-form-item> 
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="标签" prop="tag">
        <el-select
          v-model="temp.tag"
          placeholder="选择标签"
          clearable
          class="filter-item"
          style="width: 130px"
        >
          <el-option
            v-for="item in taglist"
            :key="item.id"
            :label="item.tag_name"
            :value="item.tag_name"
          />
        </el-select>
        </el-form-item>

        <el-form-item label="关键词" prop="keyword">
          <el-input v-model="temp.keyword" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="temp.description" placeholder="请输入描述" :rows="4" type="textarea"  />
        </el-form-item>
        <el-form-item label="活动详情" prop="content" class="helpformcont">
          <quill-editor
            v-model="temp.content"
            ref="myQuillEditor"
            style="width:100%;height:200px;"
            :options="editorOption"
          >
            <!-- 自定义toolar -->
            <div id="toolbar" slot="toolbar">
              <!-- Add a bold button -->
              <button class="ql-bold" title="加粗">Bold</button>
              <button class="ql-italic" title="斜体">Italic</button>
              <button class="ql-underline" title="下划线">underline</button>
              <button class="ql-strike" title="删除线">strike</button>
              <button class="ql-blockquote" title="引用"></button>
              <button class="ql-code-block" title="代码"></button>
              <button class="ql-header" value="1" title="标题1"></button>
              <button class="ql-header" value="2" title="标题2"></button>
              <!--Add list -->
              <button class="ql-list" value="ordered" title="有序列表"></button>
              <button class="ql-list" value="bullet" title="无序列表"></button>
              <!-- Add font size dropdown -->
              <select class="ql-header" title="段落格式">
                <option selected>段落</option>
                <option value="1">标题1</option>
                <option value="2">标题2</option>
                <option value="3">标题3</option>
                <option value="4">标题4</option>
                <option value="5">标题5</option>
                <option value="6">标题6</option>
              </select>
              <select class="ql-size" title="字体大小">
                <option value="10px">10px</option>
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px" selected>16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
              </select>
              <select class="ql-font" title="字体">
                <option value="SimSun">宋体</option>
                <option value="SimHei">黑体</option>
                <option value="Microsoft-YaHei">微软雅黑</option>
                <option value="KaiTi">楷体</option>
                <option value="FangSong">仿宋</option>
                <option value="Arial">Arial</option>
              </select>
              <!-- Add subscript and superscript buttons -->
              <select class="ql-color" value="color" title="字体颜色"></select>
              <select class="ql-background" value="background" title="背景颜色"></select>
              <select class="ql-align" value="align" title="对齐"></select>
              <button class="ql-clean" title="还原"></button>
              <!-- You can also add your own -->
            </div>
          </quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="help-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getHelpsList, postHelps, getHelps, getTagList} from '@/api/about'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'shop',
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
      addr:{
        type:'district'
      },
      value: [],
      options: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      user_disabled: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      taglist:[],
      changedata:{
        id:0
      },
      temp: {
        thumbnail_id:'',
        thumbnail_url:'',
        tag_id:5,
        id: undefined,
        title:'',
        keyword:'',
        description:'',
        content:''

      },
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        title: [
          { required: true, message: '标题必填项', trigger: 'blur' }
        ],
        tag: [
          { required: true, message: '标签为不能为空', trigger: 'change' }
        ],
        thumbnail_id: [
          { required: true, message: '缩列图为必填项', trigger: 'blur' }
        ],
        keyword: [
          { required: true, message: '关键词为必填项', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '描述为必填项', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容为必填项', trigger: 'blur' }
        ]
      },
      imagecropperShow: false,
      imagecropperKey: 0,
      upload_url: process.env.VUE_APP_BASE_API + '/api/file',
      // 富文本编辑器
      content: null,
      editorOption: {
        placeholder: "请输入",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: "#toolbar"
          }
        }
      },
    }
  },
  created() {
    this.getList()
    this.gettagsList()
  },
  methods: {
    gettagsList() {
      this.listLoading = true
      getTagList().then(response => {
        this.taglist = response.data.list
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    resetTemp() {
      this.username_disabled = false
      this.temp = {
        id: undefined,
        realname: '',
        avatar_id: '',
        avatar_url: '',
        username: '',
        password: '',
        role_id: [],
        role_name: [],
        system: '0',
        status: '1'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
        createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
           const changitem=this.taglist.filter(item=>{
            return item.tag_name==this.temp.tag
          })
          this.temp.tag_id=changitem[0].id
          postHelps(this.temp).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.temp.thumbnail_url= resData.url
      this.temp.thumbnail_id = resData.id
    },
    close() {
      this.imagecropperShow = false
    },
    getList() {
      this.listLoading = true
      getHelpsList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      row.status = status
      postHelps(row).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
        row.status_name = response.data.status_name
      })
    },
    handleUpdate(row) {
      this.changedata.id=row.id
      getHelps(this.changedata).then(response=>{
        this.temp=Object.assign({},this.temp,response.data)
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.user_disabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })


    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const changitem=this.taglist.filter(item=>{
            return item.tag_name==this.temp.tag
          })
          this.temp.tag_id=changitem[0].id
          const tempData = Object.assign({}, this.temp)
          postHelps(tempData).then(response => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
.el-tagbox.el-tag {
  margin-left: 10px;
}
.help-footer{text-align:center;}

.formcontent .el-dialog__body{
  padding-top: 10px;
}
.formcontent .helpformcont{
  height: 260px;
}
</style>
