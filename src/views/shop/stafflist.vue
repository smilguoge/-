<template>
  <div class="app-container">


    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="员工id" prop="id" align="center" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工名字" align="center" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在门店" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.store }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职业" align="center" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.job }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="220"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
      width="550px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="员工id" prop="nameid">
          <el-input v-model="temp.id" :disabled="user_disabled" />
        </el-form-item>
        <el-form-item label="员工名字" prop="name">
          <el-input v-model="temp.name" placeholder="请输入员工名字" :disabled="user_disabled"/>
        </el-form-item>
        <el-form-item label="员工电话" prop="mobile">
          <el-input v-model="temp.mobile" placeholder="请输入电话名字" :disabled="user_disabled"/>
        </el-form-item>
        <el-form-item label="请选择部门" prop="depvalue">
          <el-checkbox-group v-model="temp.depvalue" @change="changdepartment">
            <el-checkbox v-for="department in dep_options" :label="department.id" :key="department.id" name="depart">{{department.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="请选择职业" prop="job">
          <div>
              <el-select v-model="jobvalue" placeholder="请选择职业">
              <el-option
                v-for="item in job_options"
                :key="item.id"
                :label="item.name"
                :value="item.name">
                {{item.name}}
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="创建时间" prop="password">
          <el-input v-model="temp.created_at" :disabled="user_disabled" />
        </el-form-item>
        <el-form-item label="最近更新" prop="system">
          <el-input v-model="temp.updated_at" :disabled="user_disabled" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStaffList, postStaff, deleteStaff, getDeJobList } from '@/api/shop'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

const statusOptions = [
  { key: '0', display_name: '禁用' },
  { key: '1', display_name: '启用' }
]

export default {
  name: 'Staff',
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
      dep_options: [],
      job_value:[],
      job_options: [],
      jobvalue:'',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      user_disabled: false,
      listQuery: {
        page: 1,
        limit: 20,
        store_id: ''
      },
      listJob: {
        type: 'Job',
        department_id:''
      },
      listdepartment: {
        type: 'Department',
        department_id:''
      },
      statusOptions,
      temp: {
        id:'',
        job_id:'',
        department_id:'',
        depvalue:[]
      },
      tempup: {
        id:'',
        job_id:'',
        department_id:'' 
      },
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      rules: {
        depvalue: [
          { type: 'array', required: true, message: '请至少选择一个部门', trigger: 'change' }
        ]
        // job: [
        //   { required: true, message: '选择职业', trigger: 'change' }
        // ]
      },
      textMap: {
        update: '编辑',
        create: '新增'
      },
    }
  },
  created() {
    this.listQuery.store_id=this.$route.query.id
    this.getList()
    this.getdepartment(this.listdepartment)
  },
  methods: {
    changdepartment(value) {
      console.log(value)
      if(this.temp.depvalue.length!==0){
        let jobstring=this.temp.depvalue.join(',')
        jobstring="[" + jobstring + "]"
        console.log(jobstring)
        this.listJob.department_id = jobstring
        this.tempup.department_id = jobstring
        this.getjob(this.listJob)
      }else{
        this.job_options = []
        this.jobvalue = ''
      }
      // if(value.length!==0){
      //   let jobstring=value.join(',')
      //   jobstring="[" + jobstring + "]"
      //   console.log(jobstring)
      //   this.listJob.department_id = jobstring
      //   this.tempup.department_id = jobstring
      //   this.getjob(this.listJob)
      // }else{
      //   this.job_options = []
      //   this.jobvalue = ''
      // }
      },
    getjob(value) {
      this.listLoading = true
      getDeJobList(value).then(response => {
        this.job_options = response.data.list
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getdepartment(value) {
      this.listLoading = true
      getDeJobList(value).then(response => {
        this.dep_options = response.data.list
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    close() {
      this.imagecropperShow = false
    },
    getList() {
      this.listLoading = true
      getStaffList(this.listQuery).then(response => {
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
      postStaff(row).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
        row.status_name = response.data.status_name
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      console.log(row)
      this.tempup.id=row.id
      this.jobvalue=row.job
      let destring=row.department
      // let destring=row.department.replace(/\s*/g,"")
      // let length=row.department.length
      // let lens=length - 1
      // destring=destring.substring(1, lens)
      // let mapdestring=destring.split(',')
      // mapdestring=mapdestring.map(Number)
      // this.listJob.department_id = row.department
      this.temp.depvalue=row.department
      console.log(this.temp.depvalue)
      this.getjob(this.listJob)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.user_disabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      console.log(this.jobvalue)
      console.log("this.jobvalue")
            if(this.temp.depvalue.length==0){
            this.$notify({
              title: '请选择部门',
              message: '部门不能为空',
              type: 'error',
              duration: 2000
            })

      }else if(this.jobvalue==""){
            this.$notify({
              title: '请选择职业',
              message: '职业不能为空',
              type: 'error',
              duration: 2000
            })  

      }else{
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const jobb=this.job_options.filter(item=>{
            return item.name==this.jobvalue
          })
          this.tempup.job_id=jobb[0].id
          const tempData = Object.assign({}, this.tempup)
          postStaff(tempData).then(response => {
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
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteStaff(row).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-tagbox.el-tag {
  margin-left: 10px;
}
</style>
