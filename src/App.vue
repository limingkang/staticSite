<template>
  <div id="apphome" class="common-shell">
    <aside class="common-aside">
      <div class="common-aside__brand">
        <div class="common-title ellipsis">
          {{ $t('app.systemTitle') }}
        </div>
      </div>

      <div class="common-title-content">
        <elMenuItem
          :el-menu-list="elMenuList"
          :default-active="defaultActive"
          @activemenu="goToMenu"
        />
      </div>
    </aside>

    <section class="common-stage">
      <header class="common-header">
        <div class="common-header__actions">
          <el-dropdown
            class="common-header__dropdown"
            trigger="click"
            placement="bottom-end"
            popper-class="common-header-menu"
            @command="handleLanguageChange"
          >
            <button class="common-header__action common-header__action--lang" type="button">
              <span class="common-header__action-label">{{ $t('app.languageLabel') }}</span>
              <span class="common-header__action-value">{{ currentLanguageOption.label }}</span>
              <span class="common-header__action-tag">{{ currentLanguageOption.shortLabel }}</span>
              <i class="el-icon-arrow-down common-header__action-arrow" />
            </button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in languageOptions"
                :key="item.value"
                :command="item.value"
                :class="{ 'is-active': item.value === currentLang }"
              >
                <div class="common-header-menu__option">
                  <span class="common-header-menu__label">{{ item.label }}</span>
                  <span class="common-header-menu__tag">{{ item.shortLabel }}</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown
            class="common-header__dropdown"
            trigger="click"
            placement="bottom-end"
            popper-class="common-user-menu"
            @command="handleUserCommand"
          >
            <button class="common-header__action common-header__action--user" type="button">
              <span class="common-header__avatar">{{ userInitial }}</span>
              <span class="common-header__user">
                <span class="common-header__user-name">{{ displayName }}</span>
                <span class="common-header__user-code">{{ displayCode }}</span>
              </span>
              <i class="el-icon-arrow-down common-header__action-arrow" />
            </button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled>
                <div class="common-user-menu__profile">
                  <span class="common-user-menu__name">{{ displayName }}</span>
                  <span class="common-user-menu__code">{{ displayCode }}</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item command="reset-password">
                <div class="common-user-menu__action">
                  {{ $t('app.resetPassword') }}
                </div>
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <div class="common-user-menu__logout">
                  {{ $t('app.logout') }}
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </header>

      <main class="common-main">
        <div class="common-main__viewport">
          <router-view />
        </div>
      </main>
    </section>

    <el-dialog
      :title="$t('app.passwordDialog.title')"
      :visible.sync="passwordDialogVisible"
      width="420px"
      custom-class="common-password-dialog"
      append-to-body
      @closed="handlePasswordDialogClosed"
    >
      <el-form
        ref="passwordForm"
        :model="passwordForm"
        :rules="passwordRules"
        label-position="top"
        class="common-password-form"
      >
        <el-form-item :label="$t('app.passwordDialog.oldPassword')" prop="oldPassword">
          <el-input
            v-model.trim="passwordForm.oldPassword"
            :placeholder="$t('app.passwordDialog.oldPasswordPlaceholder')"
            show-password
            autocomplete="current-password"
          />
        </el-form-item>

        <el-form-item :label="$t('app.passwordDialog.newPassword')" prop="newPassword">
          <el-input
            v-model.trim="passwordForm.newPassword"
            :placeholder="$t('app.passwordDialog.newPasswordPlaceholder')"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="common-password-dialog__footer">
        <el-button @click="passwordDialogVisible = false">{{ $t('app.passwordDialog.cancel') }}</el-button>
        <el-button type="primary" :loading="passwordSubmitting" @click="handlePasswordConfirm">{{ $t('app.passwordDialog.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import elMenuItem from '@/components/elMenuItem/index.vue'
import { changePassword, getCurrentUserProfile, logout } from '@/api/authApi'
import { clearStoredUserInfo, emptyUserInfo, normalizeUserInfo, persistUserInfo } from '@/utils/auth'

export default {
  name: 'App',
  components: {
    elMenuItem,
  },
  data() {
    return {
      defaultActive: '',
      currentRootMenuId: '',
      passwordDialogVisible: false,
      passwordSubmitting: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
      },
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo || emptyUserInfo
    },
    elMenuList() {
      return this.userInfo.menus || []
    },
    displayName() {
      return this.userInfo.employeeName || this.userInfo.employeeCode || this.$t('app.guestUser')
    },
    displayCode() {
      return this.userInfo.employeeCode || this.$t('app.noCode')
    },
    userInitial() {
      return this.displayName ? this.displayName.slice(0, 1).toUpperCase() : 'U'
    },
    currentLang() {
      return this.$i18n.locale
    },
    languageOptions() {
      return this.$languageOptions || []
    },
    currentLanguageOption() {
      return this.languageOptions.find((item) => item.value === this.currentLang) || this.languageOptions[0] || {
        label: '中文',
        shortLabel: 'ZH',
      }
    },
    passwordRules() {
      const validateOldPassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('app.passwordDialog.validation.enterOldPassword')))
          return
        }
        callback()
      }
      const validateNewPassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('app.passwordDialog.validation.enterNewPassword')))
          return
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)\S{6,20}$/.test(value)) {
          callback(new Error(this.$t('app.passwordDialog.validation.passwordInvalid')))
          return
        }
        if (value === this.passwordForm.oldPassword) {
          callback(new Error(this.$t('app.passwordDialog.validation.passwordSame')))
          return
        }
        callback()
      }
      return {
        oldPassword: [
          { validator: validateOldPassword, trigger: ['blur', 'change'] },
        ],
        newPassword: [
          { validator: validateNewPassword, trigger: ['blur', 'change'] },
        ],
      }
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        this.syncMenuRoute(to.path)
      },
    },
    elMenuList() {
      this.syncMenuRoute(this.$route.path)
    },
  },
  mounted() {
    this.ensureUserProfile()
  },
  methods: {
    async ensureUserProfile() {
      if (!this.userInfo.token || this.elMenuList.length > 0) return
      try {
        const response = await getCurrentUserProfile({
          custom: true,
        })
        const nextUserInfo = normalizeUserInfo({
          ...this.userInfo,
          ...(response.data.user || {}),
          menus: response.data.menus || [],
          buttonPermissions: response.data.buttonPermissions || [],
        })
        this.$store.commit('setUserInfo', nextUserInfo)
        persistUserInfo(nextUserInfo)
      } catch (error) {
        //
      }
    },
    goToMenu(idPath) {
      const currentPath = this.normalizeMenuPath(idPath)
      if (currentPath.length > 0) {
        this.currentRootMenuId = currentPath[0]
      }
      let path = ''
      let pathList = this.elMenuList
      currentPath.forEach((id) => {
        const temp = pathList.find((item) => item.id === id)
        if (!temp) return
        path = temp.url
        pathList = temp.children || []
      })
      if (!path || path === this.$route.path) return
      this.$router.push({
        path,
      })
    },
    handleLanguageChange(lang) {
      this.$switchLanguage(lang)
    },
    async handleUserCommand(command) {
      if (command === 'reset-password') {
        this.passwordDialogVisible = true
        this.$nextTick(() => {
          if (this.$refs.passwordForm) {
            this.$refs.passwordForm.clearValidate()
          }
        })
        return
      }
      if (command === 'logout') {
        try {
          await logout({
            refreshToken: this.userInfo.refreshToken,
          }, {
            custom: true,
          })
        } catch (error) {
          //
        } finally {
          clearStoredUserInfo()
          this.$store.commit('setUserInfo', emptyUserInfo)
          this.$router.replace('/login')
        }
      }
    },
    handlePasswordDialogClosed() {
      this.passwordSubmitting = false
      this.passwordForm = {
        oldPassword: '',
        newPassword: '',
      }
      if (this.$refs.passwordForm) {
        this.$refs.passwordForm.resetFields()
      }
    },
    resolvePasswordSubmitMessage(error) {
      if (!error) {
        return this.$t('app.passwordDialog.message.failed')
      }

      if (error.message === 'Current password is incorrect') {
        return this.$t('app.passwordDialog.validation.oldPasswordIncorrect')
      }

      if (error.message === 'New password cannot be same as old password') {
        return this.$t('app.passwordDialog.validation.passwordSame')
      }

      return error.message || this.$t('app.passwordDialog.message.failed')
    },
    handlePasswordConfirm() {
      this.$refs.passwordForm.validate(async(valid) => {
        if (!valid) return
        this.passwordSubmitting = true
        try {
          const response = await changePassword({
            oldPassword: this.passwordForm.oldPassword,
            newPassword: this.passwordForm.newPassword,
          }, {
            custom: true,
          })
          const nextUserInfo = persistUserInfo({
            ...this.userInfo,
            ...(response.data || {}),
          })
          this.$store.commit('setUserInfo', nextUserInfo)
          this.passwordDialogVisible = false
          this.$message.success(this.$t('app.passwordDialog.message.success'))
        } catch (error) {
          this.$message.error(this.resolvePasswordSubmitMessage(error))
        } finally {
          this.passwordSubmitting = false
        }
      })
    },
    syncMenuRoute(path) {
      const currentMenuPath = this.findMenuPathByUrl(this.elMenuList, path)
      if (currentMenuPath.length > 0) {
        this.defaultActive = currentMenuPath[currentMenuPath.length - 1].id
        this.currentRootMenuId = currentMenuPath[0].id
        return
      }
      this.defaultActive = ''
      this.redirectToCurrentFirstMenu(path)
    },
    redirectToCurrentFirstMenu(path) {
      if (path !== '/home') return
      const currentRootMenu = this.elMenuList.find((item) => item.id === this.currentRootMenuId)
      const targetPath = this.findFirstMenuUrl(currentRootMenu) || this.findFirstMenuUrl({ children: this.elMenuList })
      if (!targetPath || targetPath === this.$route.path) return
      this.$router.replace({
        path: targetPath,
      })
    },
    resetMenuActive(path) {
      const currentMenu = this.findNodeByPath(this.elMenuList, path)
      this.defaultActive = currentMenu ? currentMenu.id : ''
    },
    normalizeMenuPath(idPath) {
      if (!idPath || idPath.length === 0) return []
      return this.elMenuList.some((item) => item.id === idPath[0]) ? idPath : [...idPath].reverse()
    },
    findMenuPathByUrl(tree, value, parents = []) {
      if (!tree || tree.length === 0) return []
      for (let i = 0; i < tree.length; i++) {
        const currentNode = tree[i]
        const currentPath = [...parents, currentNode]
        if (currentNode.url === value) return currentPath
        if (currentNode.children && currentNode.children.length > 0) {
          const childPath = this.findMenuPathByUrl(currentNode.children, value, currentPath)
          if (childPath.length > 0) return childPath
        }
      }
      return []
    },
    findNodeByPath(tree, value) {
      if (!tree || tree.length === 0) return null
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].url === value) return tree[i]
        if (tree[i].children) {
          const temp = this.findNodeByPath(tree[i].children, value)
          if (temp) return temp
        }
      }
      return null
    },
    findFirstMenuUrl(node) {
      if (!node) return ''
      if (node.url) return node.url
      if (!node.children || node.children.length === 0) return ''
      for (let i = 0; i < node.children.length; i++) {
        const childPath = this.findFirstMenuUrl(node.children[i])
        if (childPath) return childPath
      }
      return ''
    },
  },
}
</script>

<style lang="less">
#apphome {
  margin: 0;
  height: 100vh;
  padding: 14px;
  box-sizing: border-box;
  background:
    radial-gradient(circle at top left, rgba(116, 240, 255, 0.12) 0%, transparent 26%),
    radial-gradient(circle at top right, rgba(58, 102, 255, 0.12) 0%, transparent 24%),
    linear-gradient(180deg, #eef5ff 0%, var(--common-app-bg) 100%);
}

.common-shell {
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 14px;
  box-sizing: border-box;
  overflow: hidden;
}

.common-aside {
  position: relative;
  // height: 100%;
  min-height: 0;
  padding: 14px 10px 14px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(180deg, var(--common-sidebar-start) 0%, var(--common-sidebar-end) 100%);
  box-shadow: 0 22px 52px rgba(7, 18, 38, 0.24);
  display: flex;
  overflow: hidden;
  flex-direction: column;
}

.common-aside::before {
  content: '';
  position: absolute;
  inset: auto -40px -40px auto;
  width: 160px;
  height: 160px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(116, 240, 255, 0.18) 0%, transparent 72%);
  pointer-events: none;
}

.common-aside::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
  opacity: 0.45;
  pointer-events: none;
}

.common-aside__brand {
  position: relative;
  z-index: 1;
  padding: 6px 12px 8px;
}

.common-title {
  margin-top: 0;
  color: #f3fbff;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.common-title-content {
  position: relative;
  z-index: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  margin-top: 6px;
  margin-bottom: 10px;
  padding: 2px 4px 18px 8px;
}

.common-stage {
  min-width: 0;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}

.common-header {
  position: sticky;
  top: 0;
  z-index: 5;
  flex-shrink: 0;
  padding: 12px 16px;
  border-radius: 26px;
  border: 1px solid rgba(207, 224, 255, 0.88);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(244, 248, 255, 0.94) 100%);
  box-shadow: 0 18px 40px rgba(17, 34, 57, 0.08);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
}

.common-header::before {
  content: '';
  position: absolute;
  top: -54px;
  right: 60px;
  width: 160px;
  height: 160px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(24, 210, 255, 0.14) 0%, transparent 72%);
  pointer-events: none;
}

.common-header__actions {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-left: auto;
}

.common-header__dropdown {
  flex-shrink: 0;
}

.common-header__action {
  height: 44px;
  padding: 0;
  border: 1px solid rgba(17, 34, 57, 0.08);
  border-radius: 14px;
  background: rgba(248, 251, 255, 0.96);
  color: #14243a;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.common-header__action:hover {
  transform: translateY(-1px);
  border-color: rgba(58, 102, 255, 0.18);
  box-shadow: 0 10px 20px rgba(58, 102, 255, 0.08);
}

.common-header__action--lang {
  min-width: 176px;
  padding: 0 12px;
}

.common-header__action--user {
  min-width: 196px;
  padding: 0 12px 0 8px;
}

.common-header__action-label {
  color: #70819d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.common-header__action-value {
  flex: 1;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
}

.common-header__action-tag {
  min-width: 34px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background: linear-gradient(135deg, #18d2ff 0%, #3a66ff 100%);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.common-header__action-arrow {
  color: #7a8aa4;
  font-size: 12px;
}

.common-header__avatar {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: linear-gradient(135deg, #18d2ff 0%, #3a66ff 100%);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.common-header__user {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.common-header__user-name {
  max-width: 100%;
  color: #14243a;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.common-header__user-code {
  margin-top: 1px;
  color: #7b8ca6;
  font-size: 11px;
}

.common-main {
  position: relative;
  min-height: 0;
  flex: 1;
  border-radius: 28px;
  border: 1px solid rgba(207, 224, 255, 0.88);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 249, 255, 0.96) 100%);
  // box-shadow: 0 22px 48px rgba(18, 35, 56, 0.08);
  overflow: hidden;
}

.common-main::before {
  content: '';
  position: absolute;
  top: -90px;
  right: -40px;
  width: 220px;
  height: 220px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(24, 210, 255, 0.14) 0%, transparent 70%);
  pointer-events: none;
}

.common-main__viewport {
  position: relative;
  z-index: 1;
  height: 100%;
  overflow: auto;
  padding: 14px;
  box-sizing: border-box;
}

.common-header-menu,
.common-user-menu {
  padding: 8px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(15, 29, 52, 0.08);
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(5, 17, 36, 0.16);
}

.common-header-menu .el-dropdown-menu__item,
.common-user-menu .el-dropdown-menu__item {
  padding: 0;
  margin-bottom: 6px;
  line-height: normal;
  border-radius: 12px;
  overflow: hidden;
}

.common-header-menu .el-dropdown-menu__item:last-child,
.common-user-menu .el-dropdown-menu__item:last-child {
  margin-bottom: 0;
}

.common-header-menu .el-dropdown-menu__item:hover,
.common-header-menu .el-dropdown-menu__item.is-active,
.common-user-menu .el-dropdown-menu__item:hover {
  background: rgba(58, 102, 255, 0.08);
  color: #14243a;
}

.common-header-menu__option {
  min-width: 210px;
  padding: 11px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.common-header-menu__label {
  font-size: 13px;
  font-weight: 600;
}

.common-header-menu__tag {
  color: #70819d;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.common-user-menu__profile {
  min-width: 220px;
  padding: 11px 12px;
  display: flex;
  flex-direction: column;
}

.common-user-menu__name {
  color: #14243a;
  font-size: 13px;
  font-weight: 700;
}

.common-user-menu__code {
  margin-top: 4px;
  color: #7b8ca6;
  font-size: 11px;
}

.common-user-menu__action,
.common-user-menu__logout {
  min-width: 220px;
  padding: 11px 12px;
  font-size: 13px;
  font-weight: 600;
}

.common-user-menu__action {
  color: #14243a;
}

.common-user-menu__logout {
  color: #ff5f7d;
}

.common-password-dialog {
  border-radius: 24px;
  overflow: hidden;
}

.common-password-dialog .el-dialog__header {
  padding: 22px 24px 14px;
  border-bottom: 1px solid rgba(223, 233, 250, 0.9);
}

.common-password-dialog .el-dialog__title {
  color: #14243a;
  font-size: 24px;
  font-weight: 700;
}

.common-password-dialog .el-dialog__body {
  padding: 22px 24px 10px;
}

.common-password-dialog .el-dialog__footer {
  padding: 10px 24px 24px;
}

.common-password-form .el-form-item {
  margin-bottom: 22px;
}

.common-password-form .el-form-item__label {
  padding-bottom: 8px;
  color: #34445d;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
}

.common-password-form .el-input__inner {
  height: 44px;
  border-radius: 14px;
}

.common-password-form .el-form-item__error {
  padding-top: 6px;
  line-height: 1.5;
}

.common-password-form .el-form-item:last-child {
  margin-bottom: 0;
}

.common-password-dialog__footer {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.common-password-dialog__footer .el-button {
  min-width: 92px;
  height: 40px;
  border-radius: 14px;
}

@media (max-width: 1180px) {
  #apphome {
    padding: 12px;
  }

  .common-shell {
    grid-template-columns: 248px minmax(0, 1fr);
  }

  .common-header__actions {
    flex-wrap: wrap;
  }
}

@media (max-width: 900px) {
  #apphome {
    height: 100vh;
    padding: 12px;
  }

  .common-shell {
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(0, 1fr);
  }

  .common-aside {
    max-height: 320px;
  }
}

@media (max-width: 640px) {
  #apphome {
    padding: 10px;
  }

  .common-shell {
    gap: 10px;
  }

  .common-header,
  .common-main,
  .common-aside {
    border-radius: 18px;
  }

  .common-header {
    padding: 10px 12px;
  }

  .common-header__actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .common-header__action--lang,
  .common-header__action--user {
    width: 100%;
  }

  .common-main__viewport {
    padding: 12px;
  }

  .common-password-dialog {
    width: calc(100vw - 24px) !important;
    max-width: 420px;
  }

  .common-password-dialog .el-dialog__header,
  .common-password-dialog .el-dialog__body,
  .common-password-dialog .el-dialog__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .common-password-dialog .el-dialog__title {
    font-size: 20px;
  }

  .common-password-dialog__footer {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
