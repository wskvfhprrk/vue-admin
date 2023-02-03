<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.imei" placeholder="imei" style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select> -->
      <el-select v-model="listQuery.noImei" placeholder="指令前带imei" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarNoImeiOptions" :key="item.key" :label="item.noImei_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter"> 查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-edit" @click="handleCreate"> 新增 </el-button>
      <!-- <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload" > 导出excel </el-button> -->
    </div>
    <el-table :data="list" border>
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" />
      <!-- <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="{row}"> <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> </template>
      </el-table-column> -->
      <el-table-column label="imei" prop="imei" width="250px" align="center" />
      <el-table-column label="imei长度" prop="imeiLength" align="center" width="200" />
      <el-table-column label="指令前带imei" prop="noImei" class-name="status-col" width="100" :formatter="Ynformater" />
      <el-table-column label="注册信息bytes的长度" prop="registrationLength" class-name="status-col" width="200" />
      <el-table-column label="继电器检查规则id" prop="sensorCheckingRulesIds" class-name="status-col" width="100" />
      <el-table-column label="轮询传感器数据地址位顺序" prop="sensorAddressOrder" class-name="status-col" width="200" />
      <el-table-column label="轮询间隔时间" prop="intervalTime" class-name="status-col" width="100" />
      <el-table-column
        label="是否自动控制"
        prop="automaticAdjustment"
        class-name="status-col"
        width="100"
        :formatter="automaticFormatter"
      />
      <el-table-column label="心跳长度" prop="heartbeatLength" class-name="status-col" width="50" />
      <el-table-column>
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)"> 修改</el-button>
          <!-- <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button> -->
          <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete(row, $index)"> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="200px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item v-show="dialogStatus === 'update'" label="id" prop="id">
          <el-input v-model="temp.id" disabled placeholder="请输入id" />
        </el-form-item>
        <el-form-item label="imei" prop="imei">
          <el-input v-model="temp.imei" placeholder="请输入imei" />
        </el-form-item>
        <el-form-item label="imei长度" prop="imeiLength">
          <el-input v-model="temp.imeiLength" placeholder="请输入imei长度" />
        </el-form-item>
        <el-form-item label="注册信息bytes的长度" prop="registrationLength">
          <el-input v-model="temp.registrationLength" placeholder="请输入注册信息bytes的长度" />
        </el-form-item>
        <el-form-item label="传感器检查规则ID" prop="sensorCheckingRulesIds">
          <el-input v-model="temp.sensorCheckingRulesIds" placeholder="请输入传感器检查规则ID" />
        </el-form-item>
        <el-form-item label="轮询传感器数据地址位顺序" prop="sensorAddressOrder">
          <el-input v-model="temp.sensorAddressOrder" placeholder="请输入轮询传感器数据地址位顺序" />
        </el-form-item>
        <el-form-item label="心跳长度" prop="heartbeatLength">
          <el-input v-model="temp.heartbeatLength" placeholder="请输入心跳长度" />
        </el-form-item>
        <el-form-item label="轮询间隔时间" prop="intervalTime">
          <el-input v-model="temp.intervalTime" placeholder="请输入轮询间隔时间" />
        </el-form-item>
        <el-form-item label="指令前带imei" prop="noImei">
          <el-select v-model="temp.noImei" class="filter-item" placeholder="请选择">
            <el-option v-for="item in calendarNoImeiOptions" :key="item.noImei" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否自动控制" prop="automaticAdjustment">
          <el-select v-model="temp.automaticAdjustment" class="filter-item" placeholder="请选择">
            <el-option v-for="item in automaticOptions" :key="item.automaticAdjustment" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item> -->
        <!-- <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createDtuInfo, deleteDtuInfo, fetchList, updateDtuInfo } from '@/api/dtuInfo'
import Pagination from '@/components/Pagination' // 基于el分页的二级包

const calendarNoImeiOptions = [
  { key: 'true', display_name: '带的' },
  { key: 'false', display_name: '不带' }
]

const automaticOptions = [
  { key: 'true', display_name: '自动' },
  { key: 'false', display_name: '手动' }
]

export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      // 格式化数据
      calendarNoImeiOptions,
      automaticOptions,
      sortOptions: [
        { label: 'ID 顺序排列', key: '+id' },
        { label: 'ID 倒序排列', key: '-id' }
      ],
      showReviewer: false,
      temp: {
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        imei: [{ required: true, message: 'imei是必填', trigger: 'change' }],
        imeiLength: [{ required: true, message: 'imei长度是必填', trigger: 'change' }],
        registrationLength: [{ required: true, message: '注册bytes长度是必填', trigger: 'change' }],
        intervalTime: [{ required: true, message: '轮询间隔时间是必填', trigger: 'change' }],
        sensorCheckingRulesIds: [{ required: true, message: '传感器检查规则ID是必填', trigger: 'change' }],
        sensorAddressOrder: [{ required: true, message: '轮询传感器数据地址顺序是必填', trigger: 'change' }],
        heartbeatLength: [{ required: true, message: '心跳bytes长度是必填', trigger: 'change' }],
        noImei: [{ required: true, message: '指令前是否带imei值必填', trigger: 'change' }],
        automaticAdjustment: [{ required: true, message: '是否自动控制长度是必填', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 格式化表格数据
    Ynformater(row, column) {
      if (row.noImei) {
        return '带的'
      } else {
        return '不带'
      }
    },
    automaticFormatter(row, column) {
      if (row.noImei) {
        return '自动'
      } else {
        return '手动'
      }
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items
        this.total = response.data.total
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 操作状态
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    // 排序改变
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    // 重置表单数据
    resetTemp() {
      this.temp = {
      }
    },
    // 新建
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createDtuInfo(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '添加成功！',
              type: 'success',
              duration: 2000
            },
            this.getList()
            )
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateDtuInfo(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '修改成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(row, index)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delete(row, index) {
      deleteDtuInfo(row.id).then(() => {
        this.$notify({
          title: 'Success',
          message: '删除成功！',
          type: 'success',
          duration: 2000
        },
        this.getList()
        )
      })
    }
    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then((excel) => {
    //     const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const filterVal = [
    //       'timestamp',
    //       'title',
    //       'type',
    //       'importance',
    //       'status'
    //     ]
    //     const data = this.formatJson(filterVal)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'table-list'
    //     })
    //     this.downloadLoading = false
    //   })
    // },
    // formatJson(filterVal) {
    //   return this.list.map((v) =>
    //     filterVal.map((j) => {
    //       if (j === 'timestamp') {
    //         return parseTime(v[j])
    //       } else {
    //         return v[j]
    //       }
    //     })
    //   )
    // },
  }
}
</script>
