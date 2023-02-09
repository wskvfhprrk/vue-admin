<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.appModule" placeholder="应用模块" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.createTime" placeholder="创建时间" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.description" placeholder="描述说明" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.isUse" clearable placeholder="是否已用" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in isUseOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-input v-model="listQuery.itemName" placeholder="显示名" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.itemValue" placeholder="存储值" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.sortId" placeholder="排序号" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.type" placeholder="字典类型" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.parentId" placeholder="上一级ID" style="width: 200px" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter"> 查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-edit" @click="handleCreate"> 新增 </el-button>
      <!-- <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload" > 导出excel </el-button> -->
    </div>
    <el-table :data="list" border>
      <el-table-column label="数据字典ID" prop="id" align="center" width="80" />
      <!-- <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="{row}"> <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> </template>
      </el-table-column> -->
      <el-table-column label="应用模块" prop="appModule" width="100px" align="center" />
      <el-table-column label="创建时间" prop="createTime" width="100px" align="center" />
      <el-table-column label="描述说明" prop="description" width="100px" align="center" />
      <el-table-column label="是否已用" prop="isUse" width="100px" align="center" :formatter="isUseFormatter" />
      <el-table-column label="显示名" prop="itemName" width="100px" align="center" />
      <el-table-column label="存储值" prop="itemValue" width="100px" align="center" />
      <el-table-column label="排序号" prop="sortId" width="100px" align="center" />
      <el-table-column label="字典类型" prop="type" width="100px" align="center" :formatter="typeFormatter" />
      <el-table-column label="上一级ID" prop="parentId" width="100px" align="center" />
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
        <el-form-item v-show="dialogStatus === 'update'" label="数据字典ID" prop="id">
          <el-input v-model="temp.id" disabled placeholder="请输入数据字典ID" />
        </el-form-item>
        <el-form-item label="应用模块">
          <el-input v-model="temp.appModule" placeholder="请输入应用模块" />
        </el-form-item>
        <el-form-item label="描述说明">
          <el-input v-model="temp.description" placeholder="请输入描述说明" />
        </el-form-item>
        <el-form-item label="是否已用" prop="isUse">
          <el-select v-model="temp.isUse" clearable placeholder="请选择是否已用" style="width: 140px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in isUseOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示名" prop="itemName">
          <el-input v-model="temp.itemName" placeholder="请输入显示名" />
        </el-form-item>
        <el-form-item label="存储值">
          <el-input v-model="temp.itemValue" placeholder="请输入存储值" />
        </el-form-item>
        <el-form-item label="排序号" prop="sortId">
          <el-input v-model="temp.sortId" type="number" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <el-select v-model="temp.type" clearable placeholder="请选择字典类型" style="width: 140px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="上一级ID">
          <el-input v-model="temp.parentId" placeholder="请输入上一级ID" />
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
import { createDictionary, deleteDictionary, fetchList, updateDictionary, getDictionary } from '@/api/dictionary'
import Pagination from '@/components/Pagination' // 基于el分页的二级包

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
        isUse: undefined,
        itemName: undefined,
        itemValue: undefined,
        sortId: undefined,
        type: undefined,
        parentId: undefined,
        sort: '+id'
      },
      dictionary:{
        appModule: undefined,
        type: undefined
      },
      importanceOptions: [1, 2, 3],
      // 格式化数据
      isUseOptions: [
        { label: '已用', key: 'true' },
        { label: '未用', key: 'false' }
      ],
      sortOptions: [
        { label: 'ID 顺序排列', key: '+id' },
        { label: 'ID 倒序排列', key: '-id' }
      ],
      typeOptions: [
        { label: '顶级', key: 'TOP_LEVEL' },
        { label: '一级', key: 'CLASS_A' },
        { label: '二级', key: 'SECOND_LEVEL' }
      ],

      showReviewer: false,
      temp: {
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      rules: {
        createTime: [{ required: true, message: '创建时间是必填', trigger: 'blur' }],
        isUse: [{ required: true, message: '是否已用是必填', trigger: 'blur' }],
        itemName: [{ required: true, message: '显示名是必填', trigger: 'blur' }],
        sortId: [{ required: true, message: '排序号是必填', trigger: 'blur' }],
        type: [{ required: true, message: '字典类型是必填', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList(),
    this.getDictionary()
  },
  methods: {
    // 格式化表格数据
    isUseFormatter(row, column) {
      if (row.isUse) {
        return '已用'
      } else {
        return '未用'
      }
    },
    typeFormatter(row, column) {
      if (row.type === 'TOP_LEVEL') {
        return '顶级'
      } else if (row.type === 'CLASS_A') {
        return '一级'
      } else {
        return '二级'
      }
    },
    getDictionary() {
      getDictionary(this.dictionary).then((response) => {
        this.dictionary.appModule = '字典'
        this.dictionary.type = 'SECOND_LEVEL'
      })
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
