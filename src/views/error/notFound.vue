<template>
  <div class="not-found-page">
    <div class="not-found-card">
      <div class="not-found-code">
        404
      </div>
      <div class="not-found-title">
        暂无页面
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage',
  methods: {}
}
</script>

<style lang="less" scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: linear-gradient(180deg, #f6f8fc 0%, #eef3fb 100%);
  box-sizing: border-box;
}

.not-found-card {
  width: 100%;
  max-width: 520px;
  padding: 48px 40px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 18px 50px rgba(31, 54, 88, 0.12);
  text-align: center;
}

.not-found-code {
  font-size: 72px;
  line-height: 1;
  font-weight: 700;
  color: #1f6bff;
}

.not-found-title {
  margin-top: 16px;
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
}

.not-found-desc {
  margin-top: 14px;
  font-size: 15px;
  line-height: 1.8;
  color: #6b7280;
}

.not-found-actions {
  margin-top: 28px;
}

.not-found-actions .el-button + .el-button {
  margin-left: 12px;
}

@media screen and (max-width: 768px) {
  .not-found-page {
    padding: 20px;
  }

  .not-found-card {
    padding: 36px 24px;
  }

  .not-found-code {
    font-size: 60px;
  }

  .not-found-title {
    font-size: 24px;
  }

  .not-found-actions .el-button {
    width: 100%;
    margin: 0;
  }

  .not-found-actions .el-button + .el-button {
    margin-top: 12px;
  }
}
</style>
