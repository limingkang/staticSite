<template>
  <div class="resume-page">
    <section class="resume-hero">
      <div class="hero-bg" />
      <div class="resume-container hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">FRONTEND ENGINEER · DIGITAL EXPERIENCE</p>
          <h1>Alex Chen</h1>
          <p class="role">数字产品设计师 / 前端工程师 / Web 创意开发</p>
          <p class="intro">
            专注于构建清晰、高效、有质感的 Web 产品。擅长企业后台、数据看板、品牌展示页、复杂表单、
            组件封装与前端工程化，把复杂业务变成稳定、好用、好看的数字体验。
          </p>
          <div class="hero-actions">
            <a href="#projects">精选项目</a>
            <a href="mailto:hello@example.com">联系合作</a>
          </div>
        </div>

        <div class="hero-card">
          <div class="avatar">AC</div>
          <div class="hero-card__meta">
            <span>AVAILABLE FOR</span>
            <strong>Web Product Design & Development</strong>
          </div>
          <div class="radar">
            <i v-for="item in 4" :key="item" />
          </div>
        </div>
      </div>
    </section>

    <main class="resume-container resume-content">
      <section class="metrics">
        <article v-for="item in metrics" :key="item.label">
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </article>
      </section>

      <section class="section about-section">
        <div class="section-title">
          <span>01</span>
          <h2>关于我</h2>
        </div>
        <div class="about-grid">
          <p>
            我习惯先理解业务目标，再设计页面结构和组件边界。相比堆砌功能，我更关注用户真正要完成什么、
            信息如何被快速理解、后续迭代是否容易维护。
          </p>
          <div class="about-points">
            <div v-for="item in identities" :key="item.title">
              <strong>{{ item.title }}</strong>
              <span>{{ item.desc }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-title">
          <span>02</span>
          <h2>核心能力</h2>
        </div>
        <div class="skill-cloud">
          <span v-for="skill in skills" :key="skill">{{ skill }}</span>
        </div>
      </section>

      <section id="projects" class="section">
        <div class="section-title">
          <span>03</span>
          <h2>精选项目</h2>
        </div>
        <div class="project-grid">
          <article v-for="project in projects" :key="project.name" class="project-card">
            <div class="project-head">
              <span>{{ project.type }}</span>
              <em>{{ project.year }}</em>
            </div>
            <h3>{{ project.name }}</h3>
            <p>{{ project.desc }}</p>
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>
          </article>
        </div>
      </section>

      <section class="two-column">
        <article class="section">
          <div class="section-title">
            <span>04</span>
            <h2>技术栈</h2>
          </div>
          <div class="stack-list">
            <div v-for="item in stacks" :key="item.name">
              <div class="stack-label">
                <strong>{{ item.name }}</strong>
                <span>{{ item.value }}%</span>
              </div>
              <i><em :style="{ width: item.value + '%' }" /></i>
            </div>
          </div>
        </article>

        <article class="section">
          <div class="section-title">
            <span>05</span>
            <h2>成长轨迹</h2>
          </div>
          <div class="timeline">
            <div v-for="item in timeline" :key="item.time">
              <span>{{ item.time }}</span>
              <strong>{{ item.title }}</strong>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </article>
      </section>

      <section class="section">
        <div class="section-title">
          <span>06</span>
          <h2>工作方式</h2>
        </div>
        <div class="value-grid">
          <article v-for="item in values" :key="item.title">
            <strong>{{ item.title }}</strong>
            <p>{{ item.desc }}</p>
          </article>
        </div>
      </section>

      <section class="contact-section">
        <div>
          <span>LET'S BUILD SOMETHING GREAT</span>
          <h2>用清晰的工程和好看的界面，把想法真正落地。</h2>
        </div>
        <div class="contact-list">
          <p v-for="item in contacts" :key="item.label">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Resume',
  data() {
    return {
      metrics: [
        { value: '5+', label: '年 Web 项目经验' },
        { value: '40+', label: '核心模块交付' },
        { value: '18+', label: '通用组件沉淀' },
        { value: '99%', label: '线上稳定表现' },
      ],
      identities: [
        { title: '产品理解', desc: '从目标、流程和角色出发，让页面服务真实业务。' },
        { title: '视觉表达', desc: '关注版式、层级、动效和氛围，提升页面质感。' },
        { title: '工程落地', desc: '重视组件边界、代码结构、构建效率和长期维护。' },
      ],
      skills: [
        'Vue 2 / Vue 3',
        'Vue Router',
        'Vuex',
        'Element UI',
        'Vite',
        'Less / CSS3',
        '响应式布局',
        '权限系统',
        '数据看板',
        '复杂表单',
        '组件封装',
        '接口联调',
        '性能优化',
        '前端工程化',
        '动效设计',
        '设计还原',
      ],
      projects: [
        {
          name: '企业运营中台',
          year: '2025',
          type: 'Admin System',
          desc: '覆盖权限路由、用户管理、审批流、菜单配置、数据导入导出等能力，支撑多部门日常运营。',
          tags: ['Vue', 'Element UI', 'Permission'],
        },
        {
          name: '数据监控驾驶舱',
          year: '2024',
          type: 'Dashboard',
          desc: '围绕业务指标构建趋势图、排行榜、异常提示和实时概览，让关键数据在一个页面完成判断。',
          tags: ['Charts', 'Realtime', 'Responsive'],
        },
        {
          name: '组件化表单工厂',
          year: '2024',
          type: 'Components',
          desc: '沉淀弹窗表单、树选择、公式编辑器、富文本输入等高频组件，提升后台页面交付速度。',
          tags: ['Form', 'Tree', 'Editor'],
        },
        {
          name: '科技品牌视觉站',
          year: '2023',
          type: 'Website',
          desc: '使用深色视觉、霓虹光效、响应式排版和滚动分区，呈现年轻、有科技感的品牌形象。',
          tags: ['Landing', 'Motion', 'Brand'],
        },
        {
          name: '客户线索 CRM',
          year: '2023',
          type: 'CRM',
          desc: '搭建线索录入、跟进记录、客户分层、成交状态和回访提醒流程，提高销售协同效率。',
          tags: ['CRM', 'Workflow', 'Table'],
        },
        {
          name: '移动端活动页',
          year: '2022',
          type: 'Mobile H5',
          desc: '面向移动传播场景，完成首屏视觉、报名表单、规则说明和分享链路的轻量化开发。',
          tags: ['H5', 'Adaptive', 'Campaign'],
        },
      ],
      stacks: [
        { name: 'Vue Ecosystem', value: 96 },
        { name: 'UI Architecture', value: 92 },
        { name: 'CSS Motion', value: 88 },
        { name: 'Business System', value: 94 },
        { name: 'Build Tooling', value: 86 },
      ],
      timeline: [
        { time: '2024 - 至今', title: '高级前端工程师', desc: '负责核心业务后台、组件体系、页面体验优化和工程效率提升。' },
        { time: '2021 - 2024', title: '前端工程师', desc: '参与多个中后台系统建设，覆盖权限、报表、审批、客户管理等模块。' },
        { time: '2019 - 2021', title: 'Web 开发工程师', desc: '从页面开发和设计还原切入，逐步承担模块交付和接口联调工作。' },
      ],
      values: [
        { title: '先理解，再动手', desc: '在写代码前确认业务目标、用户路径、数据来源和边界状态。' },
        { title: '页面要清晰', desc: '通过间距、层级、颜色和对比，让复杂信息仍然容易阅读。' },
        { title: '组件要复用', desc: '把重复场景抽象成稳定组件，减少后续页面维护成本。' },
        { title: '交付要可靠', desc: '通过构建检查、场景自测和异常兜底，保证上线前确定性。' },
      ],
      contacts: [
        { label: '邮箱', value: 'hello@example.com' },
        { label: '城市', value: '上海 / 远程协作' },
        { label: '方向', value: '数字产品 / Web 前端 / 品牌页面' },
        { label: '状态', value: '开放项目合作' },
      ],
    }
  },
}
</script>

<style lang="less" scoped>
.resume-page {
  min-height: 100%;
  color: #ecf7ff;
  background:
    radial-gradient(circle at 15% 8%, rgba(0, 229, 255, 0.24), transparent 30%),
    radial-gradient(circle at 86% 18%, rgba(255, 64, 154, 0.18), transparent 28%),
    linear-gradient(135deg, #07111f 0%, #101a2a 48%, #0b1020 100%);
  border-radius: 22px;
  overflow-x: hidden;
}

.resume-container {
  width: calc(100% - 48px);
  max-width: 1120px;
  margin: 0 auto;
}

.resume-hero {
  position: relative;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(180deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(180deg, #000 0%, transparent 90%);
  pointer-events: none;
}

.hero-inner {
  position: relative;
  min-height: 520px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 48px;
  align-items: center;
  padding: 56px 0 48px;
}

.eyebrow {
  margin: 0 0 18px;
  color: #28f4e0;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
}

.hero-copy h1 {
  margin: 0;
  color: #ffffff;
  font-size: 76px;
  line-height: 1;
  font-weight: 900;
  text-shadow: 0 0 34px rgba(40, 244, 224, 0.28);
}

.role {
  margin: 18px 0 0;
  color: #ff76bf;
  font-size: 22px;
  font-weight: 800;
}

.intro {
  max-width: 760px;
  margin: 22px 0 0;
  color: #c8d6e5;
  font-size: 16px;
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 32px;
}

.hero-actions a {
  height: 44px;
  padding: 0 24px;
  border-radius: 999px;
  color: #ffffff;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 900;
}

.hero-actions a:first-child {
  background: linear-gradient(135deg, #23f0dd, #6674ff, #ff4ca3);
  box-shadow: 0 18px 40px rgba(35, 240, 221, 0.22);
}

.hero-actions a:last-child {
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.06);
}

.hero-card {
  position: relative;
  min-height: 420px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-card::before {
  content: '';
  position: absolute;
  inset: 18px;
  border: 1px solid rgba(40, 244, 224, 0.24);
}

.avatar {
  position: relative;
  z-index: 1;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  border: 1px solid rgba(40, 244, 224, 0.62);
  background: linear-gradient(135deg, rgba(40, 244, 224, 0.2), rgba(255, 76, 163, 0.18));
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 900;
  box-shadow: 0 0 56px rgba(40, 244, 224, 0.22);
}

.hero-card__meta {
  position: relative;
  z-index: 1;
  margin-top: 28px;
  text-align: center;
}

.hero-card__meta span {
  color: #28f4e0;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.hero-card__meta strong {
  display: block;
  margin-top: 8px;
  color: #ffffff;
  font-size: 18px;
  line-height: 1.5;
}

.radar i {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  animation: pulse 3.8s ease-in-out infinite;
}

.radar i:nth-child(1) { inset: 74px; }
.radar i:nth-child(2) { inset: 54px; animation-delay: 0.4s; }
.radar i:nth-child(3) { inset: 34px; animation-delay: 0.8s; }
.radar i:nth-child(4) { inset: 14px; animation-delay: 1.2s; }

.resume-content {
  padding: 0 0 56px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: -28px;
}

.metrics article,
.section,
.contact-section {
  border: 1px solid rgba(255, 255, 255, 0.13);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 52px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(16px);
}

.metrics article {
  min-height: 108px;
  padding: 20px;
  box-sizing: border-box;
}

.metrics strong {
  display: block;
  color: #ffffff;
  font-size: 34px;
  line-height: 1;
}

.metrics span {
  display: block;
  margin-top: 10px;
  color: #aebfd0;
  font-size: 13px;
}

.section {
  margin-top: 18px;
  padding: 26px;
  box-sizing: border-box;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-title span {
  color: #28f4e0;
  font-size: 12px;
  font-weight: 900;
}

.section-title h2 {
  margin: 0;
  color: #ffffff;
  font-size: 24px;
}

.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 22px;
}

.about-grid > p,
.project-card p,
.timeline p,
.value-grid p {
  margin: 0;
  color: #c8d6e5;
  font-size: 14px;
  line-height: 1.9;
}

.about-points,
.value-grid,
.contact-list {
  display: grid;
  gap: 12px;
}

.about-points {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.about-points div,
.value-grid article,
.contact-list p {
  margin: 0;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  background: rgba(5, 12, 22, 0.32);
  box-sizing: border-box;
}

.about-points strong,
.value-grid strong,
.contact-list strong {
  display: block;
  color: #ffffff;
  font-size: 15px;
}

.about-points span,
.contact-list span {
  display: block;
  margin-top: 8px;
  color: #aebfd0;
  font-size: 13px;
  line-height: 1.7;
}

.skill-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-cloud span {
  padding: 10px 13px;
  border: 1px solid rgba(40, 244, 224, 0.28);
  background: rgba(40, 244, 224, 0.09);
  color: #e5fffb;
  font-size: 13px;
  font-weight: 800;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.project-card {
  min-height: 250px;
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.13);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
}

.project-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.project-head span,
.project-head em {
  color: #28f4e0;
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.project-card h3 {
  margin: 0 0 12px;
  color: #ffffff;
  font-size: 19px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.project-tags span {
  padding: 6px 8px;
  border: 1px solid rgba(255, 118, 191, 0.38);
  color: #ff9fd0;
  font-size: 11px;
  font-weight: 900;
}

.two-column {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.stack-list {
  display: grid;
  gap: 16px;
}

.stack-label {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.stack-label strong {
  color: #ffffff;
  font-size: 14px;
}

.stack-label span {
  color: #28f4e0;
  font-size: 13px;
  font-weight: 900;
}

.stack-list i {
  display: block;
  height: 9px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
}

.stack-list em {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #28f4e0, #6674ff, #ff76bf);
}

.timeline {
  display: grid;
  gap: 16px;
}

.timeline div {
  padding-left: 16px;
  border-left: 2px solid rgba(40, 244, 224, 0.36);
}

.timeline span {
  color: #28f4e0;
  font-size: 12px;
  font-weight: 900;
}

.timeline strong {
  display: block;
  margin: 7px 0;
  color: #ffffff;
  font-size: 16px;
}

.value-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.value-grid p {
  margin-top: 8px;
  font-size: 13px;
}

.contact-section {
  margin-top: 18px;
  padding: 30px;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 24px;
  align-items: center;
}

.contact-section > div > span {
  color: #28f4e0;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.contact-section h2 {
  margin: 10px 0 0;
  color: #ffffff;
  font-size: 28px;
  line-height: 1.35;
}

.contact-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.contact-list span {
  margin-top: 0;
  color: #28f4e0;
  font-weight: 900;
}

.contact-list strong {
  margin-top: 8px;
  line-height: 1.5;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(0.98);
    opacity: 0.38;
  }

  50% {
    transform: scale(1.04);
    opacity: 0.72;
  }
}

@media (max-width: 1180px) {
  .hero-inner,
  .about-grid,
  .two-column,
  .contact-section {
    grid-template-columns: 1fr;
  }

  .hero-card {
    min-height: 320px;
  }

  .project-grid,
  .about-points,
  .value-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .resume-container {
    width: calc(100% - 28px);
  }

  .hero-inner {
    padding-top: 36px;
    gap: 28px;
  }

  .hero-copy h1 {
    font-size: 48px;
  }

  .role {
    font-size: 18px;
  }

  .metrics,
  .project-grid,
  .about-points,
  .value-grid,
  .contact-list {
    grid-template-columns: 1fr;
  }

  .section,
  .contact-section {
    padding: 20px;
  }
}
</style>
