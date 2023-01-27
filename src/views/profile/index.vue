<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-form>
            <el-form-item label="Name">
              <el-input v-model.trim="user.name" />
            </el-form-item>
            <el-form-item label="Email">
              <el-input v-model.trim="user.email" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit">修改资料</el-button>
            </el-form-item>
          </el-form>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'

export default {
  name: 'Profile',
  components: { UserCard},
  data() {
    return {
      user: {}
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    },
    submit() {
      this.$message({
        message: '个人信息修改成功！',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
