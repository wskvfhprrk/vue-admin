<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.automaticAdjustment" placeholder="是否自动控制——true是自动false是手动控制" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.imei" placeholder="imei" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.intervalTime" placeholder="每组轮询指令隔时间(毫秒)——与dtu每组间隔时间要一致" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.registrationLength" placeholder="dtu注册信息的长度" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.sensorAddressOrder" placeholder="感应器地址顺序" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.userId" placeholder="" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.noImei" placeholder="指令前带imei" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarNoImeiOptions" :key="item.key" :label="item.noImei_name" :value="item.key" />
      </el-select>-->
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter"> 查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-edit" @click="handleCreate"> 新增 </el-button>
      <!-- <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload" > 导出excel </el-button> -->
    </div>
    <el-table :data="list" border>
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <!-- <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="{row}"> <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> </template>
      </el-table-column> -->
      <el-table-column label="imei" prop="imei" width="100px" align="center" />
      <el-table-column label="dtu注册信息的长度" prop="registrationLength" width="100px" align="center" />
      <el-table-column label="感应器地址顺序" prop="sensorAddressOrder" width="100px" align="center" />
      <el-table-column label="用户信息" prop="userId" width="100px" align="center" />
      <el-table-column>
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)"> 修改</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)"> 删除</el-button>
          <!--          <el-button size="mini" type="success" @click="automaticAdjustmentStatus(row)"> 修改自动控制状态</el-button>-->
          <!-- <el-button v-if="row.status!='draft'" size="mini" @click="automaticAdjustmentStatus(row,'draft')"> Draft </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="200px" style="width: 400px; margin-left: 50px">
        <el-form-item v-show="dialogStatus === 'update'" label="ID" prop="id">
          <el-input v-model="temp.id" disabled placeholder="请输入ID" />
        </el-form-item>
        <el-form-item label="是否自动控制——true是自动false是手动控制" prop="automaticAdjustment">
          <el-input v-model="temp.automaticAdjustment" placeholder="请输入是否自动控制——true是自动false是手动控制" />
        </el-form-item>
        <el-form-item label="imei" prop="imei">
          <el-input v-model="temp.imei" placeholder="请输入imei" />
        </el-form-item>
        <el-form-item label="每组轮询指令隔时间(毫秒)——与dtu每组间隔时间要一致" prop="intervalTime">
          <el-input v-model="temp.intervalTime" type="number" placeholder="请输入每组轮询指令隔时间(毫秒)——与dtu每组间隔时间要一致" />
        </el-form-item>
        <el-form-item label="dtu注册信息的长度" prop="registrationLength">
          <el-input v-model="temp.registrationLength" type="number" placeholder="请输入dtu注册信息的长度" />
        </el-form-item>
        <el-form-item label="感应器地址顺序" prop="sensorAddressOrder">
          <el-input v-model="temp.sensorAddressOrder" placeholder="请输入感应器地址顺序" />
        </el-form-item>
        <el-form-item label="用户信息" prop="userId">
          <el-input v-model="temp.userId" placeholder="请输入用户信息" />
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

// const calendarNoImeiOptions = [
//   { key: 'true', display_name: '带的' },
//   { key: 'false', display_name: '不带' }
// ]
// const automaticOptions = [
//   { key: 'true', display_name: '自动' },
//   { key: 'false', display_name: '手动' }
// ]

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
        automaticAdjustment: undefined,
        imei: undefined,
        intervalTime: undefined,
        registrationLength: undefined,
        sensorAddressOrder: undefined,
        userId: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      // 格式化数据
      // calendarNoImeiOptions,
      // automaticOptions,
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
        automaticAdjustment: [{ required: true, message: '是否自动控制——true是自动false是手动控制是必填', trigger: 'blur' }],
        imei: [{ required: true, message: 'imei是必填', trigger: 'blur' }],
        intervalTime: [{ required: true, message: '每组轮询指令隔时间(毫秒)——与dtu每组间隔时间要一致是必填', trigger: 'blur' }],
        registrationLength: [{ required: true, message: 'dtu注册信息的长度是必填', trigger: 'blur' }],
        sensorAddressOrder: [{ required: true, message: '感应器地址顺序是必填', trigger: 'blur' }],
        userId: [{ required: true, message: '是必填', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 格式化表格数据
    automaticAdjustmentFormat(row, column) {
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
            },
            this.getList()
            )
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delete(row) {
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
  }
}
</script>
