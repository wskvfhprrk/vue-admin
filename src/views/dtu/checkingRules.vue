<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.commonLength" placeholder="地址位长度" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select> -->
      <!-- <el-select v-model="listQuery.commonLength" placeholder="地址位长度" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarNoImeiOptions" :key="item.key" :label="item.noImei_name" :value="item.key" />
      </el-select> -->
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
      <el-table-column label="名称" prop="name" width="250px" align="center" />
      <el-table-column label="总长度" prop="commonLength" align="center" width="100" />
      <el-table-column label="地址位长度" prop="addressBitLength" width="100" />
      <el-table-column label="功能码长度" prop="functionCodeLength" width="100" />
      <el-table-column label="数据位长度" prop="dataBitsLength" width="100" />
      <el-table-column label="数据值长度" prop="dataValueLength" width="100" />
      <el-table-column label="crc16校验位长度" prop="crc16CheckDigitLength" width="100" />
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
        <el-form-item v-show="dialogStatus === 'update'" label="id" prop="id">
          <el-input v-model="temp.id" disabled placeholder="请输入id" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="总长度" prop="commonLength">
          <el-input v-model="temp.commonLength" placeholder="请输入总长度" />
        </el-form-item>
        <el-form-item label="地址位长度" prop="addressBitLength">
          <el-input v-model="temp.addressBitLength" placeholder="请输入地址位长度" />
        </el-form-item>
        <el-form-item label="功能码长度" prop="functionCodeLength">
          <el-input v-model="temp.functionCodeLength" placeholder="请输入功能码长度" />
        </el-form-item>
        <el-form-item label="数据位长度" prop="dataBitsLength">
          <el-input v-model="temp.dataBitsLength" placeholder="请输入数据位长度" />
        </el-form-item>
        <el-form-item label="数据值长度" prop="dataValueLength">
          <el-input v-model="temp.dataValueLength" placeholder="请输入数据值长度" />
        </el-form-item>
        <el-form-item label="crc16校验位长度" prop="crc16CheckDigitLength">
          <el-input v-model="temp.crc16CheckDigitLength" placeholder="请输入crc16校验位长度" />
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
import { createCheckingRules, deleteCheckingRules, fetchList, updateCheckingRules } from '@/api/checkingRules'
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
        imei: undefined,
        noImei: undefined,
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
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        name: [{ required: true, message: '名称是必填', trigger: 'change' }],
        commonLength: [{ required: true, message: '总长度是必填', trigger: 'change' }],
        addressBitLength: [{ required: true, message: '地址位长度是必填', trigger: 'change' }],
        functionCodeLength: [{ required: true, message: '功码长度是必填', trigger: 'change' }],
        dataBitsLength: [{ required: true, message: '数据位长度是必填', trigger: 'change' }],
        dataValueLength: [{ required: true, message: '数据值长度是必填', trigger: 'change' }],
        crc16CheckDigitLength: [{ required: true, message: 'crc16校验位长度是必填', trigger: 'change' }]
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
    // 校验数据
    calibrationData() {
      if (this.temp.commonLength === (Number(this.temp.addressBitLength) + Number(this.temp.functionCodeLength) + Number(this.temp.dataBitsLength) + Number(this.temp.dataValueLength) + Number(this.temp.crc16CheckDigitLength))) {
        return true
      } else {
        this.$message({
          type: 'error',
          message: '总长度应该等于其它几个长度之和！'
        })
        return false
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
          if (!this.calibrationData()) {
            return
          }
          createCheckingRules(this.temp).then(() => {
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
          if (!this.calibrationData()) {
            return
          }
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateCheckingRules(tempData).then(() => {
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
      deleteCheckingRules(row.id).then(() => {
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
