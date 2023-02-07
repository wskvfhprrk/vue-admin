<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.appModule" placeholder="应用模块" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.createTime" placeholder="创建时间" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.description" placeholder="描述说明" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.extdata" placeholder="扩展JSON" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.isDeletable" placeholder="是否可删" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.isDeleted" placeholder="删除标记" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.isEditable" placeholder="是否可改" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.itemName" placeholder="显示名" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.itemValue" placeholder="存储值" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.sortId" placeholder="排序号" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.tenantId" placeholder="租户ID" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.type" placeholder="字典类型" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.parentId" placeholder="ID" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="应用模块" prop="appModule" width="100px" align="center" />
      <el-table-column label="创建时间" prop="createTime" width="100px" align="center" />
      <el-table-column label="描述说明" prop="description" width="100px" align="center" />
      <el-table-column label="扩展JSON" prop="extdata" width="100px" align="center" />
      <el-table-column label="是否可删" prop="isDeletable" width="100px" align="center" />
      <el-table-column label="删除标记" prop="isDeleted" width="100px" align="center" />
      <el-table-column label="是否可改" prop="isEditable" width="100px" align="center" />
      <el-table-column label="显示名" prop="itemName" width="100px" align="center" />
      <el-table-column label="存储值" prop="itemValue" width="100px" align="center" />
      <el-table-column label="排序号" prop="sortId" width="100px" align="center" />
      <el-table-column label="租户ID" prop="tenantId" width="100px" align="center" />
      <el-table-column label="字典类型" prop="type" width="100px" align="center" />
      <el-table-column label="ID" prop="parentId" width="100px" align="center" />
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
        <el-form-item label="应用模块" prop="appModule">
          <el-input v-model="temp.appModule" placeholder="请输入应用模块" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-input v-model="temp.createTime" placeholder="请输入创建时间" />
        </el-form-item>
        <el-form-item label="描述说明" prop="description">
          <el-input v-model="temp.description" placeholder="请输入描述说明" />
        </el-form-item>
        <el-form-item label="扩展JSON" prop="extdata">
          <el-input v-model="temp.extdata" placeholder="请输入扩展JSON" />
        </el-form-item>
        <el-form-item label="是否可删" prop="isDeletable">
          <el-input v-model="temp.isDeletable" type="number" placeholder="请输入是否可删" />
        </el-form-item>
        <el-form-item label="删除标记" prop="isDeleted">
          <el-input v-model="temp.isDeleted" type="number" placeholder="请输入删除标记" />
        </el-form-item>
        <el-form-item label="是否可改" prop="isEditable">
          <el-input v-model="temp.isEditable" type="number" placeholder="请输入是否可改" />
        </el-form-item>
        <el-form-item label="显示名" prop="itemName">
          <el-input v-model="temp.itemName" placeholder="请输入显示名" />
        </el-form-item>
        <el-form-item label="存储值" prop="itemValue">
          <el-input v-model="temp.itemValue" placeholder="请输入存储值" />
        </el-form-item>
        <el-form-item label="排序号" prop="sortId">
          <el-input v-model="temp.sortId" type="number" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="租户ID" prop="tenantId">
          <el-input v-model="temp.tenantId" placeholder="请输入租户ID" />
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <el-input v-model="temp.type" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="ID" prop="parentId">
          <el-input v-model="temp.parentId" placeholder="请输入ID" />
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
import { createDictionary, deleteDictionary, fetchList, updateDictionary } from '@/api/dictionary'
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
        appModule: undefined,
        createTime: undefined,
        description: undefined,
        extdata: undefined,
        isDeletable: undefined,
        isDeleted: undefined,
        isEditable: undefined,
        itemName: undefined,
        itemValue: undefined,
        sortId: undefined,
        tenantId: undefined,
        type: undefined,
        parentId: undefined,
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
        appModule: [{ required: true, message: '应用模块是必填', trigger: 'blur' }],
        createTime: [{ required: true, message: '创建时间是必填', trigger: 'blur' }],
        description: [{ required: true, message: '描述说明是必填', trigger: 'blur' }],
        extdata: [{ required: true, message: '扩展JSON是必填', trigger: 'blur' }],
        isDeletable: [{ required: true, message: '是否可删是必填', trigger: 'blur' }],
        isDeleted: [{ required: true, message: '删除标记是必填', trigger: 'blur' }],
        isEditable: [{ required: true, message: '是否可改是必填', trigger: 'blur' }],
        itemName: [{ required: true, message: '显示名是必填', trigger: 'blur' }],
        itemValue: [{ required: true, message: '存储值是必填', trigger: 'blur' }],
        sortId: [{ required: true, message: '排序号是必填', trigger: 'blur' }],
        tenantId: [{ required: true, message: '租户ID是必填', trigger: 'blur' }],
        type: [{ required: true, message: '字典类型是必填', trigger: 'blur' }],
        parentId: [{ required: true, message: 'ID是必填', trigger: 'blur' }]
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
          createDictionary(this.temp).then(() => {
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
          updateDictionary(tempData).then(() => {
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
      deleteDictionary(row.id).then(() => {
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
