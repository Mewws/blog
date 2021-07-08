<template>
    <div id="edit">
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Imanage/Imanage_index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>管理文章</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片展示文章区域-->
      <el-card class="el-card">
        <!--文章表格-->
        <el-table class="el-table" ref="filterTable" :data="showJournals" style="width: 100%">
          <!--索引列-->
          <el-table-column type="index" width="100">
          </el-table-column>
          <!--日期列-->
          <el-table-column prop="date" label="日期" width="350">
          </el-table-column>
          <!--标题列-->
          <el-table-column prop="title" label="标题" width="350">
          </el-table-column>
          <!--分类列-->
          <el-table-column prop="tag" label="分类" width="350"
            :filters="filters"
            :filter-method="filterTag"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                disable-transitions>{{scope.row.tag}}</el-tag>
            </template>
          </el-table-column>
          <!--操作栏-->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--编辑按钮-->
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <!--删除按钮-->
              <el-button class="delete_btn" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
import { Notification } from 'element-ui'
export default {
  name: 'Edit',
  data () {
    return {
      select: '',
      showJournals: [],
      search: '',
      filters: [
        { text: '前端', value: '前端 ' },
        { text: 'JavaScript', value: 'JavaScript ' },
        { text: '生活', value: '生活 ' }
      ],
      tag: '',
      options: [{
        value: '选项1',
        label: '全部'
      }, {
        value: '选项2',
        label: '前端'
      }, {
        value: '选项3',
        label: 'JavaScript'
      }, {
        value: '选项4',
        label: '生活'
      }],
      deliverId: ''
    }
  },
  methods: {
    selectValue (e) {
    },
    clearFilter () {
      this.$refs.filterTable.clearFilter()
    },
    formatter (row, column) {
      this.$router.push({ name: 'Modify', query: { row } })
    },
    // 标签筛选博客
    filterTag (value, row) {
      const a = value.trim()
      return row.tag === a
    },
    // 修改博客
    handleEdit (index, row) {
      const aid = row._id
      this.$router.push({ name: 'Modify', params: { id: aid } })
    },
    // 删除博客
    handleDelete (index, row) {
      this.$http({
        method: 'post',
        url: 'deleteBlog',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          aid: row._id
        }
      }).then(ret => {
        if (ret.data === '删除成功') {
          this.showJournals = this.showJournals.filter(value => {
            return value._id !== row._id
          })
          Notification({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
        }
      })
    }
  },
  mounted () {
    const that = this
    that.$http({
      method: 'get',
      url: 'getAllBlogs'
    }).then(function (ret) {
      that.showJournals = ret.data
    })
  }
}
</script>

<style scoped>
  .el-table{
    height: auto;
  }
  .delete_btn{
    margin-left: 10px;
  }
</style>
