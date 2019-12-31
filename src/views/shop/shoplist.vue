<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        clearable
        style="width: 200px;"
        class="filter-item"
        placeholder="门店名字"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="logo" prop="id" align="center" width="150">
        <template slot-scope="scope">
          <img :src="scope.row.logo" width="50px" height="50px"/>
        </template>
      </el-table-column>
      <el-table-column label="门店id" prop="id" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌名字" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.brand }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门店名字" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在城市" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" align="center" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.province}}{{ scope.row.city}}{{ scope.row.district}}{{ scope.row.addr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="老板" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.boss }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期时间" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.expiration_date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="250"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="goStafflist(scope.row.id)">员工列表</el-button>
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
        <el-form-item label="门店id" prop="logo">
        <img :src="temp.logo" :disabled="user_disabled" width="130px" height="130px" />
        </el-form-item>
        <el-form-item label="门店id" prop="nameid">
          <el-input v-model="temp.id" :disabled="user_disabled" />
        </el-form-item>
        <el-form-item label="门店名字" prop="name">
          <el-input v-model="temp.name" placeholder="请输入门店名字" />
        </el-form-item>
        <el-form-item label="经营品牌" prop="brand">
          <el-input v-model="temp.brand" placeholder="请输入品牌名字" />
        </el-form-item>
        <el-form-item label="请选择省市区" prop="地址">
          <div>
                <el-cascader
                v-model="value"
                :options="options"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="详细地址" prop="addr">
          <el-input v-model="temp.addr" placeholder="请输入详情地址" />
        </el-form-item>
        <el-form-item label="老板" prop="boss">
          <el-input v-model="temp.boss" :disabled="user_disabled" />
        </el-form-item>
        <el-form-item label="邀请码" prop="qrcode">
          <el-input v-model="temp.invite_code" :disabled="user_disabled" />
        </el-form-item>
        <!-- <el-form-item label="创建时间" prop="created_atpassword">
          <el-input v-model="temp.created_at" :disabled="user_disabled" />
        </el-form-item> -->
        <el-form-item label="到期时间" prop="password">
          <el-input v-model="temp.expiration_date" :disabled="user_disabled" />
        </el-form-item>
        <!-- <el-form-item label="最近更新" prop="updated_at">
          <el-input v-model="temp.updated_at" :disabled="user_disabled" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getShopList, postShop, deleteShop,getaddress} from '@/api/shop'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

const statusOptions = [
  { key: '0', display_name: '禁用' },
  { key: '1', display_name: '启用' }
]

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
        limit: 20,
        keyword: ''
      },
      statusOptions,
      temp: {
        id: '',
        name: "",
        brand: "",
        logo: "",
        logo_id: "",
        addr: "",
        province: "",
        city: "",
        district: "",
        boss: "",
        mobile: "",
        invite_code: "",
        qrcode: ""
      },
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {

      },
      imagecropperShow: false,
      imagecropperKey: 0,
      upload_url: process.env.VUE_APP_BASE_API + '/api/file'
    }
  },
  created() {
    this.getList()
    this.getAddr()
  },
  methods: {
      goStafflist(id){
        console.log(id)
        const query={id:id}
        this.$router.push({path:'/shop/stafflist',query
          }
        )

      },
      getAddr() {
      this.listLoading = true
      getaddress(this.addr).then(response => {
        this.options=response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.temp.logo = resData.url
      this.temp.logo_id = resData.id
    },
    handleChange(value) {
      this.temp.province_id=value[0]
      this.temp.city_id=value[1]
      this.temp.district_id=value[2]   
      },
    close() {
      this.imagecropperShow = false
    },
    getList() {
      this.listLoading = true
      getShopList(this.listQuery).then(response => {
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
      postShop(row).then(response => {
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
      let optionprovie=this.options.filter(item=>{
        return item.label==this.temp.province
      })
      let optionprovie1=optionprovie[0].children
      let optioncity=optionprovie1.filter(item=>{
        return item.label==this.temp.city
      })
      let optioncity1=optioncity[0].children
      let optiondistrict=optioncity1.filter(item=>{
        return item.label==this.temp.district
      })
      this.value[0]=optionprovie[0].id
      this.value[1]=optioncity[0].id
      this.value[2]=optiondistrict[0].id
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
          const tempData = Object.assign({}, this.temp)
          postShop(tempData).then(response => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, response.data)
                break
              }
            }
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
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteShop(row).then(() => {
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
