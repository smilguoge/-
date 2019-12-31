<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        clearable
        style="width: 200px;"
        class="filter-item"
        placeholder="名称"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
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
      <el-table-column label="序号" prop="sort" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="海报" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.img_url"
            :preview-src-list="[scope.row.img_url]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="活动时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.start_time}}~{{ scope.row.end_time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary"  @click="handleUpdate(scope.row)">编辑</el-button>
           <el-button type="warning"  @click="handleAll(scope.row)">管理</el-button>
           <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <!--<el-dropdown split-button type="primary" class="bj_button_box">
            <!--<div class="bj_button" @click="handleUpdate(scope.row)">编辑</div>
            <el-dropdown-menu slot="dropdown" class="bj_menu">
              <el-dropdown-item>
                <el-button type="text" size="mini" @click="adminList(scope.row)">管理员</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" size="mini" @click="orderList(scope.row)">定单列表</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" size="mini" @click="CustomerList(scope.row)">客户列表</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" size="mini" @click="ordersignList(scope.row)">客户签到</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" size="mini" @click="orderReviewList(scope.row)">回访列表</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" size="mini" @click="brandList(scope.row)">活动品牌</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" size="mini" @click="demandList(scope.row)">活动需求</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" size="mini" @click="StampList(scope.row)">盖章信息</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除活动</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>-->
          </el-dropdown>
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
      :visible.sync="dialogFormVisibleBrand"
      :close-on-press-escape="dialogEsc"
      :close-on-click-modal="dialogEsc"
      width
    >
      <el-form
        ref="dataFormBrand"
        :rules="rulesBrand"
        :model="tempBrand"
        label-position="left"
        label-width="80px"
        style="width: 600px; margin-left:50px;"
        class="formActivity"
      >
        <el-input
          v-model="tempBrand.id"
          placeholder="请输入活动id"
          type="hidden"
          style="width:0px;height:0px;"
        />

        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="tempBrand.name" placeholder="请输入活动名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleBrand = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createDataBrand():updateDataBrand()"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisibleStamp"
      :close-on-press-escape="dialogEsc"
      :close-on-click-modal="dialogEsc"
      width
    >
      <el-form
        ref="dataFormStamp"
        :rules="rulesStamp"
        :model="tempStamp"
        label-position="left"
        label-width="80px"
        style="width: 600px; margin-left:50px;"
        class="formActivity"
      >
        <el-input
          v-model="tempStamp.id"
          placeholder="请输入活动id"
          type="hidden"
          style="width:0px;height:0px;"
        />
        <el-form-item label="客户意向" prop="intention">
          <el-input v-model="tempStamp.intention " placeholder="请输入客户意向" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleStamp = false">取消</el-button>
        <el-button type="primary" @click="updateDataStamp()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisibleCustomer"
      :close-on-press-escape="dialogEsc"
      :close-on-click-modal="dialogEsc"
      width
    >
      <el-form
        ref="dataFormCustomer"
        :rules="rulesCustomer"
        :model="tempCustomer"
        label-position="left"
        label-width="80px"
        style="width: 600px; margin-left:50px;"
        class="formActivity"
      >
        <el-input
          v-model="tempCustomer.id"
          placeholder="请输入活动id"
          type="hidden"
          style="width:0px;height:0px;"
        />

        <el-form-item label="姓名" prop="name">
          <el-input v-model="tempCustomer.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="tempCustomer.mobile" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="tempCustomer.sex" placeholder="请选择">
            <el-option
              v-for="item in sexList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品需求" prop="demand_ids">
          <el-checkbox-group v-model="tempCustomer.demand_ids" @change="checkList1">
            <el-checkbox
              v-for="item in checkListall"
              :label="item.id"
              :value="item.id"
              :key="item.id"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="客户来源" prop="source">
          <el-select v-model="tempCustomer.source_key" placeholder="请选择">
            <el-option
              v-for="item in CustList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="tempCustomer.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleCustomer = false">取消</el-button>
        <el-button type="primary" @click="updateDataCustomer()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisibleDemand"
      :close-on-press-escape="dialogEsc"
      :close-on-click-modal="dialogEsc"
      width
    >
      <el-form
        ref="dataFormDemand"
        :rules="rulesDemand"
        :model="tempDemand"
        label-position="left"
        label-width="80px"
        style="width: 600px; margin-left:50px;"
        class="formActivity"
      >
        <el-input
          v-model="tempDemand.id"
          placeholder="请输入活动id"
          type="hidden"
          style="width:0px;height:0px;"
        />

        <el-form-item label="需求名" prop="name">
          <el-input v-model="tempDemand.name" placeholder="请输入需求名" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input type="number" v-model="tempDemand.sort" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleDemand = false">取消</el-button>
        <el-button type="primary" @click="createDataDemand()">确定</el-button>
      </div>
    </el-dialog>
    <!--管理员新增（编辑）-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisibleAdmin"
      :close-on-press-escape="dialogEsc"
      :close-on-click-modal="dialogEsc"
      width
    >
      <el-form
        ref="dataFormAdmin"
        :rules="rulesAdmin"
        :model="tempAdmin"
        label-position="left"
        label-width="80px"
        style="width: 600px; margin-left:50px;"
        class="formActivity"
      >
        <el-input
          v-model="tempAdmin.id"
          placeholder="请输入活动id"
         type="hidden"
         style="width:0px;height:0px;"
        />

        <el-form-item label="姓名" prop="realname">
          <el-input v-model="tempAdmin.realname" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input type="number" v-model="tempAdmin.mobile " placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="品牌" prop="brand_id">
        <el-input v-model="tempAdmin.brand_id" placeholder="请输入品牌" type="hidden" style="width:0px;height:0px;"/>
        <el-select v-model="tempAdmin.brand_id" placeholder="请选择">
            <el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
              v-model="tempAdmin.status"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options_status"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="邀请码" prop="label_id">
          <el-input v-model="tempAdmin.label_id" placeholder="请输入邀请码" />
        </el-form-item>
        <el-form-item label="门店" prop="store_id">
           <el-select
              v-model="tempAdmin.store_id"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options_shop"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="tempAdmin.password" placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdmin = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createDataAdmin():updateDataAdmin()">确定</el-button>
      </div>
    </el-dialog>
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
        class="formActivity"
      >
        <el-input
          v-model="temp.id"
          placeholder="请输入活动id"
          type="hidden"
          style="width:0px;height:0px;"
        />
        <el-form-item label="管理员" prop="manege_id">
          <el-select v-model="temp.manege_id" placeholder="请选择" @change="getAdminId">
            <el-option
              v-for="item in temp.adminList"
              :key="item.id"
              :label="item.realname"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-input
            v-model="temp.manege_id "
            placeholder="请输入管理员id"
            type="hidden"
            style="width:0px;height:0px;"
          />
        </el-form-item>
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="上传图片" prop="img_id">
          <el-upload
            class="avatar-uploader"
            action="http://rt-adminapi.bzffs.cc/api/file"
            :show-file-list="false"
            :headers="headers"
            :on-success="imgSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="imgTxt">(只能上传jpg/png文件，且不超过2MB)</p>
        </el-form-item>
        <el-input
          v-model="temp.img_id"
          placeholder="请上传图片id"
          type="hidden"
          style="width:0px;height:0px;"
        />
        <el-form-item label="活动时间" prop="start_time">
          <el-input
            v-model="temp.start_time"
            placeholder="请输入活动名称"
            type="hidden"
            style="width:0px;height:0px;"
          />
          <el-input
            v-model="temp.end_time"
            placeholder="请输入活动名称"
            type="hidden"
            style="width:0px;height:0px;"
          />
          <div class="time_box">
            <el-date-picker
              v-model="value2"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              @change="getactivityTime"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="属于省市区" prop="province_id" style="height:30px">
          <el-cascader
            v-model="valueAddress"
            :options="options"
            @change="handleChange"
            style="width:320px"
          ></el-cascader>
          <el-input
            v-model="temp.province_id"
            placeholder="请输入门店省份id"
            type="hidden"
            style="width:0px;height:0px;"
          />
          <el-input
            v-model="temp.city_id "
            placeholder="请输入门店城市id"
            type="hidden"
            style="width:0px;height:0px;"
          />
          <el-input
            v-model="temp.district_id "
            placeholder="请输入门店城市id"
            type="hidden"
            style="width:0px;height:0px;"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input type="number" v-model="temp.sort " placeholder="排序" />
          <p class="imgTxt">(填写排序，只能为数字)</p>
        </el-form-item>
        <el-form-item label="活动详情" prop="content">
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 新增订单信息 -->
    <el-dialog
      title="新增"
      :visible.sync="dialogOrderSetadd"
      width="40%"
      :close-on-press-escape="dialogEsc"
      :close-on-click-modal="dialogEsc"
    >
      <el-form
        ref="dataFormOrderadd"
        :rules="rulesOrder"
        :model="tempOrder"
        label-position="left"
        label-width="80px"
        style="width: 600px; margin-left:50px;"
        class="formActivity"
      >
        <el-input
          v-model="tempOrder.id"
          placeholder="请输入定单id"
          type="hidden"
          style="width:0px; height:0px;"
        />
         <el-form-item label="客户id" prop="customer_id">
          <el-input v-model="tempOrder.customer_id" placeholder="请输入客户id" />
        </el-form-item>
         <el-form-item label="定单品牌id" prop="order_brand_id">
          <el-input v-model="tempOrder.order_brand_id  " placeholder="请输入定单品牌id" />
        </el-form-item>
         <el-form-item label="定单经理id" prop="order_user_id">
          <el-input v-model="tempOrder.order_user_id  " placeholder="请输入定单经理id" />
        </el-form-item>
         <el-form-item label="售卡品牌id" prop="card_brand_id">
          <el-input v-model="tempOrder.card_brand_id  " placeholder="请输入售卡品牌id" />
        </el-form-item>
         <el-form-item label="售卡经理id" prop="card_user_id">
          <el-input v-model="tempOrder.card_user_id  " placeholder="请输入售卡经理id" />
        </el-form-item>
        <el-form-item label="带单品牌" prop="from_brand_id">
          <el-select v-model="tempOrder.from_brand_id" placeholder="请选择">
            <el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-input
            v-model="tempOrder.from_brand_id"
            placeholder="请输入带单品牌"
            type="hidden"
            style="width:0px; height:0px;"
          />
        </el-form-item>

        <el-form-item label="带单人" prop="from_user_id">
          <el-select v-model="tempOrder.from_user_id" placeholder="请选择">
            <el-option
              v-for="item in options3"
              :key="item.id"
              :label="item.realname"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-input
            v-model="tempOrder.from_user_id"
            placeholder="请输入带单人"
            type="hidden"
            style="width:0px; height:0px;"
          />
        </el-form-item>
        <el-form-item label="定金金额" prop="downpayment">
          <el-input v-model="tempOrder.downpayment " placeholder="请输入定金金额" />
        </el-form-item>
        <el-form-item label="交易方式" prop="pay_type">
          <el-select v-model="tempOrder.pay_type" placeholder="请选择" @change="getpayType">
            <el-option
              v-for="item in options1"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
          <el-input
            v-model="tempOrder.pay_type"
            placeholder="请输入交易方式"
            type="hidden"
            style="width:0px; height:0px;"
          />
        </el-form-item>
        <el-form-item label="礼券发放情况" prop="discount">
          <el-input v-model="tempOrder.discount" placeholder="请输入礼券发放情况" />
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="tempOrder.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogOrderSetadd = false">取 消</el-button>
        <el-button type="primary" @click="createDataOrder()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑订单信息 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogOrderSet"
      width="40%"
      :close-on-press-escape="dialogEsc"
      :close-on-click-modal="dialogEsc"
    >
      <el-form
        ref="dataFormOrder"
        :rules="rulesOrder"
        :model="tempOrder"
        label-position="left"
        label-width="80px"
        style="width: 600px; margin-left:50px;"
        class="formActivity"
      >
        <el-input
          v-model="tempOrder.id"
          placeholder="请输入定单id"
          type="hidden"
          style="width:0px; height:0px;"
        />
        <el-form-item label="带单品牌" prop="from_brand_id">
          <el-select v-model="tempOrder.from_brand_id" placeholder="请选择">
            <el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-input
            v-model="tempOrder.from_brand_id"
            placeholder="请输入带单品牌"
            type="hidden"
            style="width:0px; height:0px;"
          />
        </el-form-item>

        <el-form-item label="带单人" prop="from_user_id">
          <el-select v-model="tempOrder.from_user_id" placeholder="请选择">
            <el-option
              v-for="item in options3"
              :key="item.id"
              :label="item.realname"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-input
            v-model="tempOrder.from_user_id"
            placeholder="请输入带单人"
            type="hidden"
            style="width:0px; height:0px;"
          />
        </el-form-item>
        <el-form-item label="定金金额" prop="downpayment">
          <el-input v-model="tempOrder.downpayment " placeholder="请输入定金金额" />
        </el-form-item>
        <el-form-item label="交易方式" prop="pay_type">
          <el-select v-model="tempOrder.pay_type" placeholder="请选择" @change="getpayType">
            <el-option
              v-for="item in options1"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
          <el-input
            v-model="tempOrder.pay_type"
            placeholder="请输入交易方式"
            type="hidden"
            style="width:0px; height:0px;"
          />
        </el-form-item>
        <el-form-item label="礼券发放情况" prop="discount">
          <el-input v-model="tempOrder.discount" placeholder="请输入礼券发放情况" />
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="tempOrder.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogOrderSet = false">取 消</el-button>
        <el-button type="primary" @click="updateDataOrder()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 总列表 -->
    <el-dialog
  :visible.sync="dialogAll"
  width="80%"
     :close-on-press-escape="dialogEsc"
      :close-on-click-modal="dialogEsc"
  >
  <template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="管理员列表" name="first">
    <div class="filter-container">
        <el-input
          v-model="AdminlistQuery.realname"
          clearable
          style="width: 200px;"
          class="filter-item"
          placeholder="真实姓名"
          @keyup.enter.native="handleFilter2"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter2"
        >搜索</el-button>
        <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreateAdmin"
      >新增</el-button>
        <el-button
          v-waves
          class="filter-item"
           type="success"
          icon="el-icon-upload2"
          @click="exportExcel"
        >导出数据</el-button>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading2"
        :data="listAdmin"
        border
        highlight-current-row
        style="width: 100%;"
        id="orderTable1"
      >
        <el-table-column label="id" prop="id" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="真实姓名" prop="name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.realname}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" prop="mobile" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column label="邀请码" prop="label" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.label_id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="品牌" prop="brand" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.brand}}</span>
          </template>
        </el-table-column>
        <el-table-column label="门店" prop="store" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.store}}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" prop="role" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.role}}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="create_at" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.create_at}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核" prop="status" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.status"
              placeholder="请选择"
              @change="getAdminStatus(scope.row)"
            >
              <el-option
                v-for="item in options_status"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="250"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdateAdmin(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete2(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="AdminlistQuery.page"
        :limit.sync="AdminlistQuery.limit"
        @pagination="adminList"
      />
    </el-tab-pane>
    <el-tab-pane label="定单列表" name="first2">
     <div class="filter-container">
        <el-input
          v-model="OrderlistQuery.name"
          clearable
          style="width: 200px;"
          class="filter-item"
          placeholder="名字"
          @keyup.enter.native="handleFilter1"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter1"
        >搜索</el-button>
        <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreateOrder"
      >新增</el-button>
        <el-button
          v-waves
          class="filter-item"
          type="success"
          icon="el-icon-upload2"
          @click="exportExcel2"
        >导出数据</el-button>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading1"
        :data="Orderlist"
        border
        highlight-current-row
        style="width: 100%;"
        id="orderTable2"
      >
        <el-table-column label="id" prop="sort" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="名字" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column label="条形码" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.qrcode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.addr}}</span>
          </template>
        </el-table-column>
        <el-table-column label="定单品牌" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.order_brand}}</span>
          </template>
        </el-table-column>
        <el-table-column label="带单品牌" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.from_brand}}</span>
          </template>
        </el-table-column>
        <el-table-column label="带单人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.from_user}}</span>
          </template>
        </el-table-column>
        <el-table-column label="定金金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.downpayment}}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易方式" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.pay_type_text}}</span>
          </template>
        </el-table-column>
        <el-table-column label="礼券发放情况" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.discount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.create_at}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="250"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate1(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete1(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="OrderlistQuery.page"
        :limit.sync="OrderlistQuery.limit"
        @pagination="orderList"
      />

    </el-tab-pane>
    <el-tab-pane label="客户列表" name="first3">
    <el-button
          v-waves
          class="filter-item"
          type="success"
          icon="el-icon-upload2"
          @click="exportExcel3"
        >导出数据</el-button>
      <el-table
        :key="tableKey"
        v-loading="listLoading1"
        :data="Customerlist"
        border
        highlight-current-row
        style="width: 100%;"
         id="orderTable3"
      >
        <el-table-column label="id" prop="id" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="名字" prop="name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机" prop="mobile" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="sex_text" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.sex_text}}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户来源" prop="source" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.source}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="250"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate3(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete5(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="客户签到" name="first4">
    <div class="filter-container">
        <el-input
          v-model="OrderlistSignQuery.name"
          clearable
          style="width: 200px;"
          class="filter-item"
          placeholder="客户姓名"
          @keyup.enter.native="handleFilter3"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter3"
        >搜索</el-button>
        <el-button
          v-waves
          class="filter-item"
          type="success"
          icon="el-icon-upload2"
          @click="exportExcel4"
        >导出数据</el-button>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading3"
        :data="OrderlistSign"
        border
        highlight-current-row
        style="width: 100%;"
         id="orderTable4"
      >
        <el-table-column label="id" prop="id" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户姓名" prop="name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" prop="mobile" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" prop="addr" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.addr}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="OrderlistSignQuery.page"
        :limit.sync="OrderlistSignQuery.limit"
        @pagination="ordersignList"
      />
    </el-tab-pane>
    <el-tab-pane label="回访列表" name="first5">
     <div class="filter-container">
        <el-input
          v-model="OrderlistReviewQuery.name"
          clearable
          style="width: 200px;"
          class="filter-item"
          placeholder="客户姓名"
          @keyup.enter.native="handleFilter4"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter4"
        >搜索</el-button>
        <el-button
          v-waves
          class="filter-item"
          type="success"
          icon="el-icon-upload2"
          @click="exportExcel5"
        >导出数据</el-button>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading3"
        :data="OrderlistReview"
        border
        highlight-current-row
        style="width: 100%;"
         id="orderTable5"
      >
        <el-table-column label="id" prop="id" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户姓名" prop="name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" prop="mobile" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" prop="addr" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.addr}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="OrderlistReviewQuery.page"
        :limit.sync="OrderlistReviewQuery.limit"
        @pagination="orderReviewList"
      />
    </el-tab-pane>
    <el-tab-pane label="活动品牌" name="first6">
     <div class="filter-container">
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreateBrand"
        >新增</el-button>
        <el-button
          v-waves
          class="filter-item"
          type="success"
          icon="el-icon-upload2"
          @click="exportExcel6"
        >导出数据</el-button>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading1"
        :data="Brandlist"
        border
        highlight-current-row
        style="width: 100%;"
         id="orderTable6"
      >
        <el-table-column label="id" prop="id" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="品牌名称" prop="name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="250"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate2(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete3(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="活动需求" name="first7">
      <div class="filter-container">
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreateDemand"
        >新增</el-button>
        <el-button
          v-waves
          class="filter-item"
          type="success"
          icon="el-icon-upload2"
          @click="exportExcel7"
        >导出数据</el-button>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading1"
        :data="Demandlist"
        border
        highlight-current-row
        style="width: 100%;"
         id="orderTable7"
      >
        <el-table-column label="id" prop="id" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="需求" prop="name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动名" prop="activity" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.activity}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="250"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete4(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-tab-pane>
    <el-tab-pane label="盖章信息" name="first8">
    <el-button
          v-waves
          class="filter-item"
          type="success"
          icon="el-icon-upload2"
          @click="exportExcel8"
        >导出数据</el-button>
      <el-table
        :key="tableKey"
        v-loading="listLoading1"
        :data="Stamplist"
        border
        highlight-current-row
        style="width: 100%;"
         id="orderTable8"
      >
        <el-table-column label="id" prop="id" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户姓名" prop="name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机" prop="mobile" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" prop="addr" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.addr}}</span>
          </template>
        </el-table-column>
        <el-table-column label="客戶需求" prop="intention" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.intention}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="250"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate4(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete6(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogAll = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import { Quill, quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
//引入font.css
import "../../styles/font.scss";
// 引入表格导出
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
// 自定义字体大小
let Size = Quill.import("attributors/style/size");
Size.whitelist = ["10px", "12px", "14px", "16px", "18px", "20px"];
Quill.register(Size, true);

// 自定义字体类型
var fonts = [
  "SimSun",
  "SimHei",
  "Microsoft-YaHei",
  "KaiTi",
  "FangSong",
  "Arial",
  "Times-New-Roman",
  "sans-serif",
  "宋体",
  "黑体"
];
var Font = Quill.import("formats/font");
Font.whitelist = fonts;
Quill.register(Font, true);
import { getMenutree } from "@/api/menu";
import {
  getactivityList,
  getAdminList,
  postactivity,
  getRegion,
  deleteactivity,
  getOrderList,
  postactivityOrder,
  getPaytype,
  deleteOrder,
  getAdminerList,
  AdminSave,
  deleteadminer,
  getOrderListSign,
  getOrderListReview,
  getBrandList,
  Brandadd,
  Orderadd,
  Brandsave,
  Adminsave,
  deleteBrand,
  getDemandList,
  Demandadd,
  Adminadd,
  deleteDemand,
  getStampList,
  getCustomerList,
  Customersave,
  Stampsave,
  getCusttype,
  deleteCustomer,
  deleteStamp,
  deleteActivebrand,
  getShopid
} from "@/api/activity";
import waves from "@/directive/waves"; // Waves directive
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "activityList",
  components: { Pagination, quillEditor },
  directives: { waves },
  data() {
    return {
      // 活动管理tab
       activeName: 'first',
      // 订单交易方式
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      value_paytype: "",
      // 活动品牌列表
      dialogBrand: false,
      dialogDemand: false,
      // 订单列表
      dialogOrder: false,
      // 管理员列表
      dialogAdmin: false,
      dialogStamp: false,
      dialogCustomer: false,
      // 客户签到列表
      dialogOrdersign: false,
      dialogOrderReview: false,
       dialogAll: false,
      // 管理员状态
      options_shop:[
        {
          id: 0,
          name:'无'
        }
      ],
      options_status: [
        {
          value: 0,
          label: "未审核"
        },
        {
          value: 1,
          label: "通过"
        },
        {
          value: 2,
          label: "拒绝"
        }
      ],
      checkListall: [],
      sexList: [
        {
          value: 0,
          label: "未知"
        },
        {
          value: 1,
          label: "男"
        },
        {
          value: 2,
          label: "女"
        }
      ],
      CustList: [],
      checkList: [],
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
      // 活动日期
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: [],
      // 地址联动
      valueAddress: [],
      options: [],
      // 图片上传
      imageUrl: "",
      tableKey: 0,
      list: null,
      Orderlist: null,
      Brandlist: null,
      Demandlist: null,
      Adminlist: null,
      Stamplist: null,
      Customerlist: null,
      OrderlistSign: null,
      OrderlistReview: null,
      listAdmin: [
        {
          status: ""
        }
      ],
      total: 0,
      listLoading: true,
      listLoading1: true,
      listLoading2: true,
      listLoading3: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: ""
      },
      OrderlistSignQuery: {
        page: 1,
        limit: 20,
        name: "",
        activity_id: ""
      },
      StamplistQuery: {
        // page: 1,
        // limit: 20,
        // name: "",
        activity_id: ""
      },
      CustomerlistQuery: {
        // page: 1,
        // limit: 20,
        // name: "",
        activity_id: ""
      },
      OrderlistQuery: {
        page: 1,
        limit: 20,
        name: "",
        activity_id: ""
      },
      brandlistQuery: {
        // page: 1,
        // limit: 20,
        // name: "",
        activity_id: ""
      },
      DemandlistQuery: {
        // page: 1,
        // limit: 20,
        // name: "",
        activity_id: ""
      },
      OrderlistReviewQuery: {
        page: 1,
        limit: 20,
        name: "",
        activity_id: ""
      },
      AdminlistQuery: {
        page: 1,
        limit: 20,
        realname: "",
        activity_id: "",
        mobile: '',
        from_brand_id:''
      },
      adminStatus: {
        id: "",
        status: "",
        status_text: ""
      },
      tempBrand: {
        id: undefined,
        name: ""
      },
      tempStamp: {
        id: undefined,
        intention: ""
      },
      tempDemand: {
        id: undefined,
        name: ""
      },
      temp: {
        id: undefined,
        adminList: "",
        realname: "",
        manege_id: "",
        name: "",
        img_id: "",
        img_url: "",
        start_time: "",
        end_time: "",
        province_id: "",
        city_id: "",
        district_id: "",
        sort: "",
        content: ""
      },
      tempOrder: {
        id: undefined,
        from_brand_id: "",
        from_user_id: "",
        downpayment: "",
        pay_type: "",
        paytypeList: "",
        discount: "",
        addr: ""
      },
      tempCustomer: {
        id: undefined,
        name: "",
        mobile: "",
        sex: "",
        demand_ids: "",
        source: "",
        addr: ""
      },
      tempAdmin: {
        id: undefined,
        realname: "",
        mobile: "",
        brand_id: "",
        status: "",
        label_id: "",
        store_id: "",
        password: ""
      },
      dialogFormVisible: false,
      dialogFormVisibleBrand: false,
      dialogFormVisibleDemand: false,
      dialogFormVisibleCustomer: false,
      dialogFormVisibleStamp: false,
      dialogFormVisibleAdmin: false,
      dialogOrderSetadd:false,
      dialogOrderSet: false,
      dialogEsc: false,
      dialogStatus: "",
      menu: null,
      textMap: {
        update: "编辑",
        create: "新增"
      },
      rules: {
        sort: [{ required: true, message: "排序必填项", trigger: "blur" }],
        name: [
          { required: true, message: "活动名称为必填项", trigger: "blur" }
        ],
        manege_id: [
          { required: true, message: "管理员id为必填项", trigger: "blur" }
        ],
        img_id: [{ required: true, message: "图片必须上传", trigger: "blur" }],
        start_time: [
          { required: true, message: "活动时间为必填项", trigger: "blur" }
        ],
        province_id: [
          { required: true, message: "城市为必填项", trigger: "blur" }
        ],
        content: [
          { required: true, message: "活动详情为必填项", trigger: "blur" }
        ]
      },
      rulesBrand: {
        name: [{ required: true, message: "品牌名称必填", trigger: "blur" }]
      },
      rulesDemand: {
        name: [{ required: true, message: "需求必填", trigger: "blur" }],
        sort: [{ required: true, message: "排序必填", trigger: "blur" }]
      },
      rulesAdmin: {
        realname: [{ required: true, message: "名字必填", trigger: "blur" }],
        mobile : [{ required: true, message: "手机号必填", trigger: "blur" }],
        brand_id : [{ required: true, message: "品牌必填", trigger: "blur" }],
        status  : [{ required: true, message: "状态必填", trigger: "blur" }],
        label_id  : [{ required: true, message: "邀请码必填", trigger: "blur" }],
        store_id  : [{ required: true, message: "门店id必填", trigger: "blur" }],
        password  : [{ required: true, message: "密码必填", trigger: "blur" }],
      },
      rulesOrder: {
        from_brand_id: [
          { required: true, message: "带单品牌必填项", trigger: "blur" }
        ],
        from_user_id: [
          { required: true, message: "带单人必填项", trigger: "blur" }
        ],
        downpayment: [
          { required: true, message: "定金金额必填项", trigger: "blur" }
        ],
        pay_type: [
          { required: true, message: "交易方式必填项", trigger: "blur" }
        ],
        discount: [
          { required: true, message: "礼券发放情况必填项", trigger: "blur" }
        ],
        customer_id : [{ required: true, message: "必填项", trigger: "blur" }],
        order_brand_id : [{ required: true, message: "必填项", trigger: "blur" }],
        order_user_id : [{ required: true, message: "必填项", trigger: "blur" }],
        card_brand_id : [{ required: true, message: "必填项", trigger: "blur" }],
        card_user_id : [{ required: true, message: "必填项", trigger: "blur" }],
      },
      rulesCustomer: {
        name: [{ required: true, message: "名字必填项", trigger: "blur" }],
        mobile: [{ required: true, message: "手机号必填项", trigger: "blur" }],
        sex: [{ required: true, message: "性别必填项", trigger: "blur" }],
        demand_ids: [
          { required: true, message: "需求必填项", trigger: "blur" }
        ],
        source: [
          { required: true, message: "客户来源必填项", trigger: "blur" }
        ],
        addr: [{ required: true, message: "地址必填项", trigger: "blur" }]
      },
      rulesStamp: {
        intention: [
          { required: true, message: "客户意向必填项", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    getMenutree().then(response => {
      this.menu = response.data;
    });
  },
  computed: {
    headers() {
      var mytoken = document.cookie;
      var newtoken = decodeURI(mytoken);
      var thisTolen = newtoken.split("=")[1];
      console.log(thisTolen, "图片提交请求token");
      return {
        Authorization: thisTolen // 直接从本地获取token就行
      };
    }
  },
  methods: {
    // 获取门店列表
    removeform(){
       this.rulesAdmin = {
        realname: [{ required: true, message: "名字必填", trigger: "blur" }],
        mobile : [{ required: true, message: "手机号必填", trigger: "blur" }],
        brand_id : [{ required: true, message: "品牌必填", trigger: "blur" }],
        status  : [{ required: true, message: "状态必填", trigger: "blur" }],
        label_id  : [{ required: true, message: "邀请码必填", trigger: "blur" }],
        store_id  : [{ required: true, message: "门店id必填", trigger: "blur" }],
        password  : [{ required: false, message: "密码必填", trigger: "blur" }],
      }
    },
    addform(){
       this.rulesAdmin = {
        realname: [{ required: true, message: "名字必填", trigger: "blur" }],
        mobile : [{ required: true, message: "手机号必填", trigger: "blur" }],
        brand_id : [{ required: true, message: "品牌必填", trigger: "blur" }],
        status  : [{ required: true, message: "状态必填", trigger: "blur" }],
        label_id  : [{ required: true, message: "邀请码必填", trigger: "blur" }],
        store_id  : [{ required: true, message: "门店id必填", trigger: "blur" }],
        password  : [{ required: true, message: "密码必填", trigger: "blur" }],
      }
    },
    getShopid(){
      getShopid().then(response => {
        this.options_shop = response.data.list;
        console.log(this.options_shop);
      });
    },
    // 导出表格
    exportExcel () {
          //表名
          var xlsxParam = { raw: true }
          var wb = XLSX.utils.table_to_book(document.querySelector('#orderTable1'),xlsxParam)
          var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'table.xlsx')
          } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
          return wbout
    },
    exportExcel2(){
          //表名
          var xlsxParam = { raw: true }
          var wb = XLSX.utils.table_to_book(document.querySelector('#orderTable2'),xlsxParam)
          var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'table.xlsx')
          } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
          return wbout
    },
    exportExcel3(){
          //表名
          var xlsxParam = { raw: true }
          var wb = XLSX.utils.table_to_book(document.querySelector('#orderTable3'),xlsxParam)
          var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'table.xlsx')
          } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
          return wbout
    },
    exportExcel4(){
          //表名
          var xlsxParam = { raw: true }
          var wb = XLSX.utils.table_to_book(document.querySelector('#orderTable4'),xlsxParam)
          var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'table.xlsx')
          } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
          return wbout
    },
    exportExcel5(){
          //表名
          var xlsxParam = { raw: true }
          var wb = XLSX.utils.table_to_book(document.querySelector('#orderTable5'),xlsxParam)
          var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'table.xlsx')
          } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
          return wbout
    },
    exportExcel6(){
          //表名
          var xlsxParam = { raw: true }
          var wb = XLSX.utils.table_to_book(document.querySelector('#orderTable6'),xlsxParam)
          var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'table.xlsx')
          } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
          return wbout
    },
    exportExcel7(){
          //表名
          var xlsxParam = { raw: true }
          var wb = XLSX.utils.table_to_book(document.querySelector('#orderTable7'),xlsxParam)
          var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'table.xlsx')
          } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
          return wbout
    },
    exportExcel8(){
          //表名
          var xlsxParam = { raw: true }
          var wb = XLSX.utils.table_to_book(document.querySelector('#orderTable8'),xlsxParam)
          var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'table.xlsx')
          } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
          return wbout
    },
    // 活动管理tabs切换
     handleClick(tab, event, row) {
        
        if(tab.name == 'first') {
        	// 触发‘配置管理’事件
        	this.adminList(row)
        }
        if(tab.name == 'first2'){
        	// 触发‘配置管理’事件
        	this.orderList(row)
        }
        if(tab.name == 'first3'){
        	// 触发‘配置管理’事件
        	this.CustomerList(row)
        }
         if(tab.name == 'first4'){
        	// 触发‘配置管理’事件
        	this.ordersignList(row)
        }
         if(tab.name == 'first5'){
        	// 触发‘配置管理’事件
        	this.orderReviewList(row)
        }
         if(tab.name == 'first6'){
        	// 触发‘配置管理’事件
        	this.brandList(row)
        }
         if(tab.name == 'first7'){
        	// 触发‘配置管理’事件
        	this.demandList(row)
        }
         if(tab.name == 'first8'){
        	// 触发‘配置管理’事件
        	this.StampList(row)
        }
      },
    // 绑定需求check
    checkList1(value) {
      console.log(value);
    },
    // 客户列表
    CustomerList(row) {
      // this.dialogCustomer = true;
      this.listLoading1 = true;
      getCustomerList(this.CustomerlistQuery).then(response => {
        console.log(response);
        this.Customerlist = response.data.list;
        this.total = response.data.total;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading1 = false;
        }, 0.5 * 1000);
      });
    },
    // 盖章列表
    StampList(row) {
      // this.dialogStamp = true;
      this.listLoading1 = true;
      getStampList(this.StamplistQuery).then(response => {
        console.log(response);
        this.Stamplist = response.data.list;
        this.total = response.data.total;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading1 = false;
        }, 0.5 * 1000);
      });
    },
    // 活动需求列表
    demandList(row) {
     
      // this.dialogDemand = true;
      this.listLoading1 = true;
      getDemandList(this.DemandlistQuery).then(response => {
        console.log(response);
        this.Demandlist = response.data.list;
        this.total = response.data.total;
        console.log(this.Demandlist);
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading1 = false;
        }, 0.5 * 1000);
      });
    },
    // 活动品牌列表
    brandList(row) {
   
      // this.dialogBrand = true;
      this.listLoading1 = true;
      getBrandList(this.brandlistQuery).then(response => {
        console.log(response);
        this.Brandlist = response.data.list;
        this.total = response.data.total;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading1 = false;
        }, 0.5 * 1000);
      });
    },
    // 回访列表
    orderReviewList(row) {
    
      // this.dialogOrderReview = true;
      this.listLoading3 = true;
      getOrderListReview(this.OrderlistReviewQuery).then(response => {
        console.log(response);
        this.OrderlistReview = response.data.list;
        this.total = response.data.total;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading3 = false;
        }, 0.5 * 1000);
      });
    },
    // 客户签到列表
    ordersignList(row) {
   
      // this.dialogOrdersign = true;
      this.listLoading3 = true;
      getOrderListSign(this.OrderlistSignQuery).then(response => {
        console.log(response);
        this.OrderlistSign = response.data.list;
        this.total = response.data.total;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading3 = false;
        }, 0.5 * 1000);
      });
    },
    // 订单列表
    orderList(row) {
    
      // this.dialogOrder = true;
      this.listLoading1 = true;
      getOrderList(this.OrderlistQuery).then(response => {
        console.log(response);
        this.Orderlist = response.data.list;
        this.total = response.data.total;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading1 = false;
        }, 0.5 * 1000);
      });
    },
    // 管理员列表
    adminList(row) {
     
      // this.dialogAdmin = true;
      this.listLoading2 = true;
      getAdminerList(this.AdminlistQuery).then(response => {
        console.log(response , '管理员列表');
        this.listAdmin = response.data.list;
        this.total = response.data.total;
        console.log(this.listAdmin);
        // // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading2 = false;
        }, 0.5 * 1000);
      });
    },
    // 地区联动
    address() {
      getRegion().then(response => {
        this.options = response.data;
      });
    },
    handleChange(value) {
      console.log(value);
      this.temp.province_id = value[0];
      this.temp.city_id = value[1];
      this.temp.district_id = value[2];
    },
    // 活动时间
    getactivityTime(val) {
      console.log(val, "活动时间");
      this.temp.start_time = val[0];
      this.temp.end_time = val[1];
    },
    // 管理员id传给input
    getAdminId(res) {
      this.temp.manege_id = res;
    },
    getpayType(data) {
      console.log(data);
    },
    getAdminStatus(row) {
      console.log(row, "111");
      this.adminStatus.status = row.status;
      this.adminStatus.id = row.id;
      AdminSave(this.adminStatus).then(response => {
        console.log(response, "状态修改成功");
      });
    },
    // 获取管理员id
    getId() {
      getAdminList(this.listQuery).then(response => {
        this.temp.adminList = response.data.list;
      });
    },
    // 获取订单交易类型(获取带单品牌)
    getPaytypeid() {
      getPaytype().then(response => {
        this.options1 = response.data;
        console.log(this.options1);
      });
      var thisacitvityid = this.OrderlistQuery.activity_id;
      getBrandList({
        activity_id: thisacitvityid
      }).then(response => {
        this.options2 = response.data.list;
        console.log(this.options2);
      });
      getAdminerList({
        activity_id: thisacitvityid
      }).then(response => {
        this.options3 = response.data.list;
        for (var i = 0; i < response.data.list.length; i++) {
          if (response.data.list[i]["status"] != 1) {
            response.data.list.splice(i, 1);
            i--;
          }
        }
        console.log(response.data.list,'带单人');
      });
    },
    getPaytypeidCust() {
      getCusttype().then(response => {
        this.CustList = response.data;
        console.log(this.CustList);
      });
      var thisacitvityid = this.CustomerlistQuery.activity_id;
      getDemandList({
        activity_id: thisacitvityid
      }).then(response => {
        this.checkListall = response.data.list;
        console.log(this.checkListall, "活动需求");
      });
    },
    // 缩略图
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.temp.img_id = "";
    },
    imgSuccess(res, file) {
      console.log(file);
      this.imageUrl = URL.createObjectURL(file.raw);
      this.temp.img_id = file.response.data.id;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 获取活动列表
    getList() {
      this.listLoading = true;
      getactivityList(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 0.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleFilter1() {
      this.OrderlistQuery.page = 1;
      this.orderList();
    },
    handleFilter2() {
      this.AdminlistQuery.page = 1;
      this.adminList();
    },
    handleFilter3() {
      this.OrderlistSignQuery.page = 1;
      this.ordersignList();
    },
    handleFilter4() {
      this.OrderlistReviewQuery.page = 1;
      this.orderReviewList();
    },
    resetTemp() {
      this.imageUrl = "";
      this.temp = {
        id: undefined,
        adminList: "",
        realname: "",
        manege_id: "",
        name: "",
        img_id: "",
        img_url: "",
        start_time: "",
        end_time: "",
        province_id: "",
        city_id: "",
        district_id: "",
        sort: "",
        content: ""
      };
    },
    resetTempBrand() {
      this.tempBrand = {
        activity_id: undefined,
        name: ""
      };
    },
    resetTempOrder() {
      this.tempOrder = {
        activity_id: undefined,
        from_brand_id: "",
        from_user_id: "",
        downpayment: "",
        pay_type: "",
        paytypeList: "",
        discount: "",
        addr: ""
      };
    },
    resetTempAdmin() {
      this.tempAdmin = {
        realname: "",
        mobile: "",
        brand_id: "",
        status: "",
        label_id: "",
        store_id: "",
        password: ""
      };
    },
    resetTempDemand() {
      this.tempDemand = {
        activity_id: undefined,
        name: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.getId();
      this.address();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 管理员新增
    handleCreateAdmin() {
      this.addform();
      this.getShopid();
      this.getPaytypeid();
      this.resetTempAdmin();
      this.dialogStatus = "create";
      this.dialogFormVisibleAdmin = true;
      this.$nextTick(() => {
        this.$refs["dataFormAdmin"].clearValidate();
      });
    },
    // 定单新增
    handleCreateOrder() {
      this.resetTempOrder();
      this.getPaytypeid();
      this.dialogStatus = "create";
      this.dialogOrderSetadd = true;
      this.$nextTick(() => {
        this.$refs["dataFormOrderadd"].clearValidate();
      });
    },
    handleCreateBrand() {
      this.resetTempBrand();
      this.dialogStatus = "create";
      this.dialogFormVisibleBrand = true;
      this.$nextTick(() => {
        this.$refs["dataFormBrand"].clearValidate();
      });
    },
    handleCreateDemand() {
      this.resetTempDemand();
      this.dialogStatus = "create";
      this.dialogFormVisibleDemand = true;
      this.$nextTick(() => {
        this.$refs["dataFormDemand"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // this.temp.routes = this.$refs.tree.getCheckedKeys();
          postactivity(this.temp).then(response => {
            console.log(response);
            this.list.unshift(response.data);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    createDataBrand() {
      this.$refs["dataFormBrand"].validate(valid => {
        if (valid) {
          // this.temp.routes = this.$refs.tree.getCheckedKeys();
          this.tempBrand.activity_id = this.brandlistQuery.activity_id;
          Brandadd(this.tempBrand).then(response => {
            console.log(response);
            this.Brandlist.unshift(response.data);
            this.dialogFormVisibleBrand = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    createDataDemand() {
      this.$refs["dataFormDemand"].validate(valid => {
        if (valid) {
          // this.temp.routes = this.$refs.tree.getCheckedKeys();
          this.tempDemand.activity_id = this.DemandlistQuery.activity_id;
          Demandadd(this.tempDemand).then(response => {
            console.log(response);
            this.Demandlist.unshift(response.data);
            this.dialogFormVisibleDemand = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    // 定单新增(确定)
    createDataOrder() {
      this.$refs["dataFormOrder"].validate(valid => {
        if (valid) {
          // this.temp.routes = this.$refs.tree.getCheckedKeys();
          this.tempOrder.activity_id = this.OrderlistQuery.activity_id;
          Orderadd(this.tempOrder).then(response => {
            console.log(response);
            this.Orderlist.unshift(response.data);
            this.dialogOrderSet = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    // 管理员新增(确定)
    createDataAdmin() {
      this.$refs["dataFormAdmin"].validate(valid => {
        if (valid) {
          // this.temp.routes = this.$refs.tree.getCheckedKeys();
          this.tempAdmin.activity_id = this.AdminlistQuery.activity_id;
          Adminadd(this.tempAdmin).then(response => {
            console.log(response);
            this.listAdmin.unshift(response.data);
            this.dialogFormVisibleAdmin = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleAll(row){
      this.activeName = "first"
      this.dialogAll = true
      this.adminList(row);
      if (row == undefined) {
        console.log("搜索");
      }
      if (row != undefined) {
        console.log(row.id,'row不为空')
        this.AdminlistQuery.activity_id = row.id;
        this.OrderlistReviewQuery.activity_id = row.id;
        this.OrderlistReviewQuery.activity_id = row.id;
        this.DemandlistQuery.activity_id = row.id;
        this.brandlistQuery.activity_id = row.id;
        this.OrderlistQuery.activity_id = row.id;
        this.CustomerlistQuery.activity_id = row.id;
        this.StamplistQuery.activity_id = row.id;
        this.OrderlistSignQuery.activity_id = row.id;
      }
      // this.orderList(row);
      // this.CustomerList(row);
      // this.ordersignList(row);
      // this.orderReviewList(row);
      // this.brandList(row);
      // this.demandList(row);
      // this.StampList(row);
    },
    handleUpdate(row) {
      console.log(row, "获取列表");
      this.address();
      this.getId();
      this.temp = Object.assign({}, row); // copy obj
      this.imageUrl = this.temp.img_url;
      var starTime = this.temp.start_time;
      var endTime = this.temp.end_time;
      var province_id = this.temp.province_id;
      var city_id = this.temp.city_id;
      var district_id = this.temp.district_id;
      this.value2 = [];
      this.valueAddress = [];
      this.valueAddress.push(province_id, city_id, district_id);
      this.value2.push(starTime, endTime);
      console.log(this.temp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 编辑订单信息
    handleUpdate1(row) {
       this.dialogStatus = "update";
      console.log(row, "订单编辑");
      console.log(this.OrderlistQuery.activity_id);
      this.dialogOrderSet = true;
      this.getPaytypeid();
      this.tempOrder = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs["dataFormOrder"].clearValidate();
      });
    },
    // 编辑管理员信息
     handleUpdateAdmin(row) {
      console.log(row, "管理员编辑");
      this.dialogStatus = "update";
      this.dialogFormVisibleAdmin = true;
      this.getPaytypeid();
      this.getShopid();
      this.removeform();
      this.tempAdmin = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs["dataFormAdmin"].clearValidate();
      });
    },
    // 编辑品牌信息
    handleUpdate2(row) {
      console.log(row, "品牌编辑");
      this.dialogFormVisibleBrand = true;
      this.tempBrand = Object.assign({}, row);
      console.log(this.tempBrand);
      this.dialogStatus = "update";
      this.$nextTick(() => {
        this.$refs["dataFormBrand"].clearValidate();
      });
    },
    // 编辑客户信息
    handleUpdate3(row) {
      this.getPaytypeidCust();
      console.log(row, "品牌编辑");
      this.dialogFormVisibleCustomer = true;
      this.tempCustomer = Object.assign({}, row);
      console.log(this.tempCustomer);
      this.dialogStatus = "update";
      this.$nextTick(() => {
        this.$refs["dataFormCustomer"].clearValidate();
      });
    },
    // 编辑盖章
    handleUpdate4(row) {
      console.log(row, "品牌编辑");
      this.dialogFormVisibleStamp = true;
      this.tempStamp = Object.assign({}, row);
      console.log(this.tempStamp);
      this.dialogStatus = "update";
      this.$nextTick(() => {
        this.$refs["dataFormStamp"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // this.temp.routes = this.$refs.tree.getCheckedKeys();
          this.temp.img_url = this.imageUrl;
          const tempData = Object.assign({}, this.temp); //复制form的数据到当前提交的接口
          postactivity(tempData).then(response => {
            if (typeof response !== "undefined") {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1, this.temp);
                  break;
                }
              }
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000
              });
            }
          });
        }
      });
    },
    updateDataBrand() {
      this.$refs["dataFormBrand"].validate(valid => {
        if (valid) {
          // this.temp.routes = this.$refs.tree.getCheckedKeys();
          const tempData = Object.assign({}, this.tempBrand); //复制form的数据到当前提交的接口
          Brandsave(tempData).then(response => {
            if (typeof response !== "undefined") {
              for (const v of this.Brandlist) {
                if (v.id === this.tempBrand.id) {
                  const index = this.Brandlist.indexOf(v);
                  this.Brandlist.splice(index, 1, this.tempBrand);
                  break;
                }
              }
              this.dialogFormVisibleBrand = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000
              });
            }
          });
        }
      });
    },
    updateDataAdmin() {
      this.$refs["dataFormAdmin"].validate(valid => {
        if (valid) {
          // this.temp.routes = this.$refs.tree.getCheckedKeys();
          const tempData = Object.assign({}, this.tempAdmin); //复制form的数据到当前提交的接口
          Adminsave(tempData).then(response => {
            if (typeof response !== "undefined") {
              for (const v of this.listAdmin) {
                if (v.id === this.tempAdmin.id) {
                  const index = this.listAdmin.indexOf(v);
                  this.listAdmin.splice(index, 1, this.tempAdmin);
                  break;
                }
              }
              this.dialogFormVisibleAdmin = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000
              });
            }
          });
        }
      });
    },
    updateDataStamp() {
      this.$refs["dataFormStamp"].validate(valid => {
        if (valid) {
          // this.temp.routes = this.$refs.tree.getCheckedKeys();
          const tempData = Object.assign({}, this.tempStamp); //复制form的数据到当前提交的接口
          Stampsave(tempData).then(response => {
            if (typeof response !== "undefined") {
              for (const v of this.Stamplist) {
                if (v.id === this.tempStamp.id) {
                  const index = this.Stamplist.indexOf(v);
                  this.Stamplist.splice(index, 1, this.tempStamp);
                  break;
                }
              }
              this.dialogFormVisibleStamp = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000
              });
            }
          });
        }
      });
    },
    updateDataOrder() {
      this.$refs["dataFormOrder"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.tempOrder); //复制form的数据到当前提交的接口
          console.log(tempData);
          postactivityOrder(tempData).then(response => {
            if (typeof response !== "undefined") {
              for (const v of this.Orderlist) {
                if (v.id === this.tempOrder.id) {
                  const index = this.Orderlist.indexOf(v);
                  this.Orderlist.splice(index, 1, this.tempOrder);
                  break;
                }
              }
              this.dialogOrderSet = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000
              });
            }
          });
        }
      });
    },
    // 编辑客户
    updateDataCustomer() {
      this.$refs["dataFormCustomer"].validate(valid => {
        if (valid) {
          // this.temp.routes = this.$refs.tree.getCheckedKeys();
          this.tempCustomer.id = this.tempCustomer.customer_id;
          console.log(this.tempCustomer.id);
          const tempData = Object.assign({}, this.tempCustomer); //复制form的数据到当前提交的接口
          console.log(tempData);
          Customersave(tempData).then(response => {
            if (typeof response !== "undefined") {
              for (const v of this.Customerlist) {
                if (v.id === this.tempCustomer.id) {
                  const index = this.Customerlist.indexOf(v);
                  this.Customerlist.splice(index, 1, this.tempCustomer);
                  break;
                }
              }
              this.dialogFormVisibleCustomer = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000
              });
            }
          });
        }
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteactivity(row).then(() => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
          });
        })
        .catch(() => {});
    },
    // 订单删除
    handleDelete1(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteOrder(row).then(() => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            const index = this.Orderlist.indexOf(row);
            this.Orderlist.splice(index, 1);
          });
        })
        .catch(() => {});
    },
    //盖章删除
    handleDelete6(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteStamp(row).then(() => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            const index = this.Stamplist.indexOf(row);
            this.Stamplist.splice(index, 1);
          });
        })
        .catch(() => {});
    },
    //客户删除
    handleDelete5(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCustomer(row).then(() => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            const index = this.Customerlist.indexOf(row);
            this.Customerlist.splice(index, 1);
          });
        })
        .catch(() => {});
    },
    // 活动需求删除
    handleDelete4(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDemand(row).then(() => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            const index = this.Demandlist.indexOf(row);
            this.Demandlist.splice(index, 1);
          });
        })
        .catch(() => {});
    },
    // 活动品牌删除
    handleDelete3(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteActivebrand(row).then(() => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            const index = this.Brandlist.indexOf(row);
            this.Brandlist.splice(index, 1);
          });
        })
        .catch(() => {});
    },
    // 管理员删除
    handleDelete2(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteadminer(row).then(() => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            const index = this.listAdmin.indexOf(row);
            this.listAdmin.splice(index, 1);
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss">
.bj_button_box .el-button--mini {
  padding: 0px;
}
.bj_menu .el-button--text {
  color: #666;
}
.bj_button_box .el-button-group > .el-button + .el-button {
  padding: 7px;
}
.bj_button_box .el-button--mini .bj_button {
  padding: 7px 15px;
}
.bj_button_box .bj_button {
}
.bj_button {
  line-height: 13px;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.hb_img {
  width: 100px;
  height: 100px;
}
.imgTxt {
  color: #999;
  margin: 0px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.time_box {
  margin-top: -26px;
}

.formActivity.el-form--label-left .el-form-item__label {
  width: 110px !important;
}
.formActivity .el-form-item__content {
  margin-left: 110px !important;
}
.el-dialog {
  margin-top: 40px !important;
}
</style>