<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.commonId" placeholder="处理返回值要使用继电器ids——在此类表中查询,0表示没有" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.correspondingCommandId" placeholder="相对应的命令id" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.dtuId" placeholder="dtuId" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.instructionTypeEnum" placeholder="指令类型枚举" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.isProcessTheReturnValue" placeholder="是否处理返回值——false表示不用，true表示必须处理" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.processingWaitingTime" placeholder="处理等待时间（毫秒）——对继电器命令进行归零操作" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.relayIds" placeholder="继电器指令——以间隔号隔开，前面是继电器id值，后面则是1为闭合指令0为断开指令" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.remarks" placeholder="备注" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="处理返回值要使用继电器ids——在此类表中查询,0表示没有" prop="commonId" width="100px" align="center" />
      <el-table-column label="相对应的命令id" prop="correspondingCommandId" width="100px" align="center" />
      <el-table-column label="dtuId" prop="dtuId" width="100px" align="center" />
      <el-table-column label="指令类型枚举" prop="instructionTypeEnum" width="100px" align="center" />
      <el-table-column label="是否处理返回值——false表示不用，true表示必须处理" prop="isProcessTheReturnValue" width="100px" align="center" />
      <el-table-column label="名称" prop="name" width="100px" align="center" />
      <el-table-column label="处理等待时间（毫秒）——对继电器命令进行归零操作" prop="processingWaitingTime" width="100px" align="center" />
      <el-table-column label="继电器指令——以间隔号隔开，前面是继电器id值，后面则是1为闭合指令0为断开指令" prop="relayIds" width="100px" align="center" />
      <el-table-column label="备注" prop="remarks" width="100px" align="center" />
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
        <el-form-item label="处理返回值要使用继电器ids——在此类表中查询,0表示没有" prop="commonId">
          <el-input v-model="temp.commonId" placeholder="请输入处理返回值要使用继电器ids——在此类表中查询,0表示没有" />
        </el-form-item>
        <el-form-item label="相对应的命令id" prop="correspondingCommandId">
          <el-input v-model="temp.correspondingCommandId" placeholder="请输入相对应的命令id" />
        </el-form-item>
        <el-form-item label="dtuId" prop="dtuId">
          <el-input v-model="temp.dtuId" placeholder="请输入dtuId" />
        </el-form-item>
        <el-form-item label="指令类型枚举" prop="instructionTypeEnum">
          <el-input v-model="temp.instructionTypeEnum" type="number" placeholder="请输入指令类型枚举" />
        </el-form-item>
        <el-form-item label="是否处理返回值——false表示不用，true表示必须处理" prop="isProcessTheReturnValue">
          <el-input v-model="temp.isProcessTheReturnValue" placeholder="请输入是否处理返回值——false表示不用，true表示必须处理" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="处理等待时间（毫秒）——对继电器命令进行归零操作" prop="processingWaitingTime">
          <el-input v-model="temp.processingWaitingTime" placeholder="请输入处理等待时间（毫秒）——对继电器命令进行归零操作" />
        </el-form-item>
        <el-form-item label="继电器指令——以间隔号隔开，前面是继电器id值，后面则是1为闭合指令0为断开指令" prop="relayIds">
          <el-input v-model="temp.relayIds" placeholder="请输入继电器指令——以间隔号隔开，前面是继电器id值，后面则是1为闭合指令0为断开指令" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" placeholder="请输入备注" />
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
import { createRelayDefinitionCommand, deleteRelayDefinitionCommand, fetchList, updateRelayDefinitionCommand } from '@/api/relayDefinitionCommand'
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
        commonId: undefined,
        correspondingCommandId: undefined,
        dtuId: undefined,
        instructionTypeEnum: undefined,
        isProcessTheReturnValue: undefined,
        name: undefined,
        processingWaitingTime: undefined,
        relayIds: undefined,
        remarks: undefined,
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
        commonId: [{ required: true, message: '处理返回值要使用继电器ids——在此类表中查询,0表示没有是必填', trigger: 'blur' }],
        correspondingCommandId: [{ required: true, message: '相对应的命令id是必填', trigger: 'blur' }],
        dtuId: [{ required: true, message: 'dtuId是必填', trigger: 'blur' }],
        instructionTypeEnum: [{ required: true, message: '指令类型枚举是必填', trigger: 'blur' }],
        isProcessTheReturnValue: [{ required: true, message: '是否处理返回值——false表示不用，true表示必须处理是必填', trigger: 'blur' }],
        name: [{ required: true, message: '名称是必填', trigger: 'blur' }],
        processingWaitingTime: [{ required: true, message: '处理等待时间（毫秒）——对继电器命令进行归零操作是必填', trigger: 'blur' }],
        relayIds: [{ required: true, message: '继电器指令——以间隔号隔开，前面是继电器id值，后面则是1为闭合指令0为断开指令是必填', trigger: 'blur' }],
        remarks: [{ required: true, message: '备注是必填', trigger: 'blur' }]
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
          createRelayDefinitionCommand(this.temp).then(() => {
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
          updateRelayDefinitionCommand(tempData).then(() => {
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
      deleteRelayDefinitionCommand(row.id).then(() => {
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
