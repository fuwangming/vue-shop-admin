<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialogVisible"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        :show-row-hover="false"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted == false"
            style="color: green"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level == 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCatForm"
        :rules="addCatFormRules"
        ref="addCatFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类的数据列表，默认为空
      catelist: [],
      //总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "isok",
        },
        {
          label: "排序",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "order",
        },
        {
          label: "操作",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "opt",
        },
      ],
      // 控制对话框的显示与隐藏
      addCatDialogVisible: false,
      // 添加分类的数据对象
      addCatForm: {
        // 将要添加的分类的名称
        cat_name: "",
        //分类父id
        cat_pid: 0,
        // 当前分类的等级,默认为一级
        cat_level: 0,
      },
      // 添加分类表单的验证规则对象
      addCatFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 选中的父级分类的ID数组
      selectedKeys: [],
      // 控制编辑分类对话框的显示与隐藏
      editCateDialogVisible: false,
      // 编辑分类表单验证
      editCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 编辑表单 绑定对象
      editCateForm: "",
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryinfo,
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取数据失败！");
      }
      // 把数据列表赋值给catelist
      this.catelist = res.data.result;
      // 为总数据条数赋值
      this.total = res.data.total;
      // this.$message.success('获取数据成功！')
    },
    //监听pagesize改变
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum改变
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage;
      this.getCateList();
    },
    // 点击按钮，显示添加分类对话框
    showAddDialogVisible() {
      // 先获取父级分类的列表
      this.getParentCateList();
      this.addCatDialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取失败！");
      }
      this.parentCateList = res.data;
    },
    // 选择项发生变化触发函数
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        //父级分类的id
        this.addCatForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 为当前分类的等级赋值
        this.addCatForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        //父级分类的id
        this.addCatForm.cat_pid = 0;
        // 为当前分类的等级赋值
        this.addCatForm.cat_level = 0;
      }
    },
    // 点击按钮，添加新的分类
    addCate() {
      this.$refs.addCatFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCatForm
        );
        if (res.meta.status != 201) {
          return this.$message.error("添加分类失败！");
        }
        this.$message.success("添加分类成功！");
        this.getCateList();
        this.addCatDialogVisible = false;
      });
    },
    // 监听对话框关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCatFormRef.resetFields();
      this.selectedKeys = [];
      this.addCatForm.cat_level = 0;
      this.addCatForm.cat_pid = 0;
    },
    // 显示编辑对话框
    async showEditCateDialog(id) {
      const { data: res } = await this.$http.get("categories/" + id);
      if (res.meta.status !== 200) return this.$message.error("获取分类失败！");
      this.editCateForm = res.data;
      this.editCateDialogVisible = true;
    },
    // 编辑分类名
    eidtCate() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "categories/" + this.editCateForm.cat_id,
          {
            cat_name: this.editCateForm.cat_name,
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("更新分类名失败！");
        this.$message.success("更新分类名成功！");
        this.getCateList();
        this.editCateDialogVisible = false;
      });
    },
    // 删除分类
    async removeCate(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      const { data: res } = await this.$http.delete("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除商品分类失败！");
      }
      this.$message.success("删除商品分类成功！");
      this.getCateList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
</style>