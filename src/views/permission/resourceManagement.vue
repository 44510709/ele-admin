<template>
  <div class="app-container">
    <div class="header">
      <el-button type="primary" @click="addMenu">+添加 </el-button>
      <div class="sel-box">
        <el-select class="mr20" v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary">查询</el-button>
      </div>
    </div>
    <!-- 表格tree： row-key，用来优化 Table 的渲染；在使用显示树形数据时，该属性是必填的。 tree-props	渲染嵌套数据的配置选项-->
    <el-table
      v-loading="loading"
      :data="apprItemData"
      style="width: 100%"
      :default-expand-all="false"
      row-key="id"
      :tree-props="{ children: 'subMenus' }"
    >
      <el-table-column prop="id" label="编号"> </el-table-column>
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="css" label="图标"> </el-table-column>
      <el-table-column prop="menuType" label="类型"> </el-table-column>
      <el-table-column prop="path" label="地址"> </el-table-column>
      <el-table-column prop="type" label="平台"> </el-table-column>
      <el-table-column prop="name" label="操作"> </el-table-column>
      <el-table-column
        prop="apprStatusStr"
        label="配置的环节"
      ></el-table-column>

      <el-table-column label="操作" align="center" width="300">
        <template>
          <el-button
            icon="el-icon-edit"
            circle
            type="text"
            size="small"
            @click="handleUpdate()"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            circle
            type="text"
            size="small"
            @click="handleDelete()"
            >删除</el-button
          >
          <el-button
            circle
            icon="el-icon-plus"
            type="text"
            size="small"
            @click="handleAdd()"
            >添加</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="680px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType" @change="changeRadio">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.type == 'PC'" :span="24">
            <el-form-item v-if="form.menuType != 'F'" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input
                  slot="reference"
                  v-model="form.tb"
                  placeholder="点击选择图标"
                  readonly
                >
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px; width: 16px"
                  />
                  <i
                    v-else
                    slot="prefix"
                    class="el-icon-search el-input__icon"
                  />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <!-- APP上传icon -->
          <el-col v-if="form.type == 'APP'" :span="24">
            <el-form-item v-if="form.menuType != 'F'" label="icon上传">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :http-request="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="form.iconUrl" :src="form.iconUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input
                v-model="form.name"
                :maxlength="20"
                placeholder="请输入菜单名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number
                v-model="form.sort"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="form.type == 'PC'" :span="24">
            <el-form-item v-if="form.menuType != 'F'" prop="path">
              <span slot="label">
                <el-tooltip
                  content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                路由地址
              </span>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.type == 'APP'" :span="24">
            <el-form-item v-if="form.menuType != 'F'" prop="androidPath">
              <span slot="label">
                <el-tooltip
                  content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                安卓路由
              </span>
              <el-input
                v-model="form.androidPath"
                placeholder="请输入安卓路由"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="form.type == 'APP'" :span="24">
            <el-form-item v-if="form.menuType != 'F'" prop="iosPath">
              <span slot="label">
                <el-tooltip
                  content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                IOS路由
              </span>
              <el-input v-model="form.iosPath" placeholder="请输入IOS路由" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.type == 'APP'" :span="24">
            <el-form-item v-if="form.menuType != 'F'" prop="h5Path">
              <span slot="label">
                <el-tooltip
                  content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                H5路由
              </span>
              <el-input v-model="form.h5Path" placeholder="请输入H5路由" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'">
              <span slot="label">
                <el-tooltip
                  content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                菜单状态
              </span>
              <el-radio-group v-model="form.hidden">
                <el-radio label="0">显示</el-radio>
                <el-radio label="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType == 'F'" :span="12">
            <el-form-item>
              <el-input
                v-model="form.perms"
                placeholder="请输入权限标识"
                maxlength="100"
              />
              <span slot="label">
                <el-tooltip
                  content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                权限字符
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单平台">
              <el-radio-group v-model="form.type">
                <el-radio label="PC">PC</el-radio>
                <el-radio label="APP">APP</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog title="提示" @click="cancel" width="30%">
      <span>确定删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
import { getMenus } from "@/api/resource";
import { handleTree } from "@/utils";

export default {
  name: "ResourceManagement",
  data() {
    return {
      // 遮罩层
      loading: true,
      apprItemData: [
        {
          id: 3,
          itemCode: "123",
          approveName: "测试事项",
          apprStatusStr: "环节名称",
          a: 1,
          children: [
            {
              id: 4,
              itemCode: "111",
              approveName: "测试事项",
              apprStatusStr: "环节名称",
              a: 1,
            },
          ],
        },
      ],
      options: [
        {
          value: "APP",
          label: "APP",
        },
        {
          value: "PC",
          label: "PC",
        },
      ],
      value: "", //选择框
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        menuType: "M",
        type: "PC",
        hidden: 0,
      },
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" },
        ],
        path: [
          { required: true, message: "路由地址不能为空", trigger: "blur" },
        ],
      },
    };
  },
  components: {
    Treeselect,
    IconSelect,
  },
  mounted() {
    this.loadItemData();
    this.getList();
  },
  // created() {},
  methods: {
    /** 查询菜单列表 */
    getList() {
      getMenus({ type: "PC" }).then((res) => {
        this.loading = true;
        res.data.sort((a, b) => a.id - b.id);
        console.log(res.data);
        this.apprItemData = res.data;
      });
    },
    // 添加
    addMenu() {
      this.reset();
      this.open = true;
      this.getTreeselect();
      this.title = "添加菜单";
    },
    //table数据
    loadItemData() {
      // var pageSize = this.pageSize;
      // var currentPage = this.currentPage;
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    // 选择目录菜单按钮
    changeRadio(val) {
      console.log(val);
      // if (val == "M") {
      //   this.$set(this.form, "parentId", 1);
      // }
    },
    // 选择图标
    selected(name) {
      this.$set(this.form, "tb", name);
      console.log(this.form);
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      getMenus().then((res) => {
        this.menuOptions = [];
        const menu = {
          id: "-1",
          name: "主类目",
          subMenus: [],
        };
        menu.subMenus = res.data;
        this.menuOptions.push(menu);
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      //奖获取的菜单格式转换成tree可以展示的数据
      // return {
      //   id: node.menuId,
      //   label: node.menuName,
      //   children: node.children,
      // };
      if (node.subMenus && node.subMenus.length > 0) {
        node.subMenus.forEach((item) => {
          if (item.subMenus && item.subMenus.length > 0) {
            item.subMenus.forEach((it) => {
              if (it.subMenus && it.subMenus.length > 0) {
              } else {
                delete it.subMenus;
              }
            });
          } else {
            delete item.subMenus;
          }
        });
      }
      if (node.subMenus && !node.subMenus.length) {
        delete node.subMenus;
      }
      return {
        id: node.id,
        label: node.name || "主类目",
        children: node.subMenus,
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加菜单";
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加菜单";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.menuId != undefined) {
            updateMenu(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMenu(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$alert('是否确认删除名称为"' + row + '"的数据项？', {
        confirmButtonText: "确定",
        callback: (action) => {
          if (action == "confirm") {
            this.$message({
              type: "info",
              message: `action: ${action}`,
            });
          }
        },
      });
    },
    // 表单重置
    reset() {
      this.form.css = "";
      this.form.hidden = "0";
      this.form.id = "";
      this.form.isMenu = 1;
      this.form.menuIds = null;
      this.form.menuType = "M";
      this.form.name = "";
      this.form.parentId = "-1";
      this.form.path = "";
      this.form.perms = null;
      this.form.roleId = null;
      this.form.sort = "";
      this.form.subMenus = null;
      this.form.type = "PC";
      this.form.url = null;
    },
    handleAvatarSuccess(res, file) {
      // this.form.iconUrl = URL.createObjectURL(file.raw);
      // console.log(this.form.iconUrl)
    },
    handleAvatarSuccess(e) {
      const file = e.file;
      const form = new FormData();
      form.append("file", file);
      fileUpload(form).then((res) => {
        if (res.code === 200) {
          const data = res.data;
          console.log(data);
          this.form.iconUrl = data.url;
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
  },
};
</script>
<style scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sel-box {
  display: flex;
}
</style>
