<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.adrss" placeholder="感应器编号地址" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.calculationFormula" placeholder="校验数据公式" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.dtuId" placeholder="dtuId" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.hex" placeholder="crc16验证码" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.max" placeholder="获取值参考最大值" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.maxRelayDefinitionCommandId" placeholder="超过最大值时的指令" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.min" placeholder="获取值参考最小值" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.minRelayDefinitionCommandId" placeholder="小于最小值时发出的指令" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.unit" placeholder="接收到数据的单位" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="感应器编号地址" prop="adrss" width="100px" align="center" />
      <el-table-column label="校验公式" prop="calculationFormula" width="100px" align="center" />
      <el-table-column label="dtuId" prop="dtuId" width="100px" align="center" />
      <el-table-column label="crc16验证码" prop="hex" width="100px" align="center" />
      <el-table-column label="获取值参考最大值" prop="max" width="100px" align="center" />
      <el-table-column label="超过最大值时的指令" prop="maxRelayDefinitionCommandId" width="100px" align="center" />
      <el-table-column label="获取值参考最小值" prop="min" width="100px" align="center" />
      <el-table-column label="小于最小值时发出的指令" prop="minRelayDefinitionCommandId" width="100px" align="center" />
      <el-table-column label="名称" prop="name" width="100px" align="center" />
      <el-table-column label="接收到数据的单位" prop="unit" width="100px" align="center" />
      <el-table-column>
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)"> 修改</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)"> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="200px" style="width: 400px; margin-left: 50px">
        <el-form-item v-show="dialogStatus === 'update'" label="ID" prop="id">
          <el-input v-model="temp.id" disabled placeholder="请输入ID" />
        </el-form-item>
        <el-form-item label="感应器编号地址" prop="adrss">
          <el-input v-model="temp.adrss" type="number" placeholder="请输入感应器编号地址" />
        </el-form-item>
        <el-form-item label="校验数据公式" prop="calculationFormula">
          <el-input v-model="temp.calculationFormula" placeholder="请输入校验数据公式" />
        </el-form-item>
        <el-form-item label="dtuId" prop="dtuId">
          <el-input v-model="temp.dtuId" placeholder="请输入dtuId" />
        </el-form-item>
        <el-form-item label="crc16验证码" prop="hex">
          <el-input v-model="temp.hex" placeholder="请输入crc16验证码" />
        </el-form-item>
        <el-form-item label="获取值参考最大值" prop="max">
          <el-input v-model="temp.max" type="number" placeholder="请输入获取值参考最大值" />
        </el-form-item>
        <el-form-item label="超过最大值时的指令" prop="maxRelayDefinitionCommandId">
          <el-input v-model="temp.maxRelayDefinitionCommandId" placeholder="请输入超过最大值时的指令" />
        </el-form-item>
        <el-form-item label="获取值参考最小值" prop="min">
          <el-input v-model="temp.min" type="number" placeholder="请输入获取值参考最小值" />
        </el-form-item>
        <el-form-item label="小于最小值时发出的指令" prop="minRelayDefinitionCommandId">
          <el-input v-model="temp.minRelayDefinitionCommandId" placeholder="请输入小于最小值时发出的指令" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="接收到数据的单位" prop="unit">
          <el-input v-model="temp.unit" placeholder="请输入接收到数据的单位" />
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
import { createSensor, deleteSensor, fetchList, updateSensor } from '@/api/sensor'
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
        adrss: undefined,
        calculationFormula: undefined,
        dtuId: undefined,
        hex: undefined,
        max: undefined,
        maxRelayDefinitionCommandId: undefined,
        min: undefined,
        minRelayDefinitionCommandId: undefined,
        name: undefined,
        unit: undefined,
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
        adrss: [{ required: true, message: '感应器编号地址是必填', trigger: 'blur' }],
        calculationFormula: [{ required: true, message: '校验地址', trigger: 'blur' }],
        dtuId: [{ required: true, message: 'dtuId是必填', trigger: 'blur' }],
        hex: [{ required: true, message: 'crc16验证码是必填', trigger: 'blur' }],
        max: [{ required: true, message: '获取值参考最大值是必填', trigger: 'blur' }],
        maxRelayDefinitionCommandId: [{ required: true, message: '超过最大值时的指令是必填', trigger: 'blur' }],
        min: [{ required: true, message: '获取值参考最小值是必填', trigger: 'blur' }],
        minRelayDefinitionCommandId: [{ required: true, message: '小于最小值时发出的指令是必填', trigger: 'blur' }],
        name: [{ required: true, message: '名称是必填', trigger: 'blur' }],
        unit: [{ required: true, message: '接收到数据的单位是必填', trigger: 'blur' }]
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
          createSensor(this.temp).then(() => {
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
          updateSensor(tempData).then(() => {
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
      deleteSensor(row.id).then(() => {
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
