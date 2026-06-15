<template>
  <div class="leaderboard">
    <div class="container">
      <section class="page-header card">
        <div class="header-text">
          <h1>🏆 创作者榜单</h1>
          <p class="header-desc">
            向每一位用心创作的作者致敬！以下是社区最活跃的创作者们。
          </p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-num">{{ totalAuthors }}</span>
            <span class="stat-label">创作者总数</span>
          </div>
        </div>
      </section>

      <section class="tabs card">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', activeTab === tab.key ? 'active' : '']"
          @click="activeTab = tab.key"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </section>

      <section class="rank-section">
        <div v-if="loading" class="loading card">正在加载榜单数据</div>

        <div v-else-if="currentList.length === 0" class="empty card">
          <div class="empty-icon">✍️</div>
          <p>还没有创作者数据，快去创建或参与故事吧！</p>
        </div>

        <div v-else>
          <div v-if="podiumList.length > 0" class="podium card">
            <div
              v-for="item in podiumList"
              :key="item.author"
              :class="['podium-item', `rank-${item._rank}`]"
            >
              <div class="podium-crown">
                {{ item._rank === 1 ? '👑' : item._rank === 2 ? '🥈' : '🥉' }}
              </div>
              <div class="podium-avatar">{{ getInitial(item.author) }}</div>
              <div class="podium-name">{{ item.author }}</div>
              <div class="podium-value">
                <span class="value-num">{{ formatValue(item, activeTab) }}</span>
                <span class="value-unit">{{ getUnit(activeTab) }}</span>
              </div>
            </div>
          </div>

          <div class="rank-list card">
            <div
              v-for="(item, index) in restList"
              :key="item.author"
              class="rank-item"
            >
              <div class="rank-index">{{ podiumList.length + index + 1 }}</div>
              <div class="rank-avatar">{{ getInitial(item.author) }}</div>
              <div class="rank-info">
                <div class="rank-name">{{ item.author }}</div>
                <div class="rank-sub">
                  <span>📖 {{ item.storyCount }} 篇故事</span>
                  <span>✏️ {{ item.entryCount }} 段接龙</span>
                  <span>📝 {{ item.totalChars }} 字</span>
                </div>
              </div>
              <div class="rank-value">
                <span class="value-num">{{ formatValue(item, activeTab) }}</span>
                <span class="value-unit">{{ getUnit(activeTab) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api.js'

const tabs = [
  { key: 'byStories', label: '参与故事数', icon: '📖' },
  { key: 'byEntries', label: '接龙段数', icon: '✏️' },
  { key: 'byChars', label: '累计字数', icon: '📝' }
]

const loading = ref(false)
const leaderboard = ref({ byStories: [], byEntries: [], byChars: [] })
const activeTab = ref('byStories')

const currentList = computed(() => leaderboard.value[activeTab.value] || [])
const totalAuthors = computed(() => currentList.value.length)

const podiumList = computed(() =>
  currentList.value.slice(0, 3).map((item, i) => ({ ...item, _rank: i + 1 }))
)
const restList = computed(() => currentList.value.slice(3))

function getInitial(name) {
  if (!name) return '?'
  return name.trim().charAt(0).toUpperCase()
}

function formatValue(item, tabKey) {
  if (tabKey === 'byStories') return item.storyCount
  if (tabKey === 'byEntries') return item.entryCount
  if (tabKey === 'byChars') {
    const chars = item.totalChars
    if (chars >= 10000) return (chars / 10000).toFixed(1) + 'w'
    if (chars >= 1000) return (chars / 1000).toFixed(1) + 'k'
    return chars
  }
  return 0
}

function getUnit(tabKey) {
  if (tabKey === 'byStories') return '篇'
  if (tabKey === 'byEntries') return '段'
  if (tabKey === 'byChars') return '字'
  return ''
}

async function loadData() {
  loading.value = true
  try {
    const data = await api.getLeaderboard()
    leaderboard.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.page-header {
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%);
  border-color: #fde68a;
}

.header-text h1 {
  font-size: 28px;
  margin-bottom: 8px;
  color: var(--text);
}

.header-desc {
  color: var(--text-muted);
  font-size: 15px;
}

.header-stats {
  flex-shrink: 0;
}

.stat-item {
  text-align: center;
  padding: 16px 24px;
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  min-width: 100px;
}

.stat-num {
  display: block;
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #f59e0b, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  padding: 8px;
  flex-wrap: wrap;
}

.tab-btn {
  flex: 1;
  min-width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--surface-alt);
  color: var(--text-muted);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: var(--border);
  color: var(--text);
}

.tab-btn.active {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  box-shadow: var(--shadow);
}

.tab-icon {
  font-size: 18px;
}

.podium {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
  padding: 32px 24px;
  background: linear-gradient(180deg, #fffbeb 0%, var(--surface) 100%);
}

.podium-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 16px;
  border-radius: var(--radius);
  position: relative;
}

.podium-item.rank-1 {
  order: 2;
  background: linear-gradient(180deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  transform: translateY(-16px);
}

.podium-item.rank-2 {
  order: 1;
  background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%);
  border: 2px solid #94a3b8;
}

.podium-item.rank-3 {
  order: 3;
  background: linear-gradient(180deg, #ffedd5 0%, #fed7aa 100%);
  border: 2px solid #fb923c;
}

.podium-crown {
  font-size: 32px;
  margin-bottom: 8px;
}

.podium-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  margin-bottom: 12px;
  box-shadow: var(--shadow);
}

.podium-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
  word-break: break-all;
}

.podium-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.podium-value .value-num {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #f59e0b, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.podium-value .value-unit {
  font-size: 13px;
  color: var(--text-muted);
}

.rank-list {
  padding: 8px 0;
  overflow: hidden;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 24px;
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;
}

.rank-item:last-child {
  border-bottom: none;
}

.rank-item:hover {
  background: var(--surface-alt);
}

.rank-index {
  width: 32px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-muted);
}

.rank-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, var(--primary-light), var(--accent-light));
  flex-shrink: 0;
}

.rank-info {
  flex: 1;
  min-width: 0;
}

.rank-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
  word-break: break-all;
}

.rank-sub {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: var(--text-muted);
}

.rank-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-shrink: 0;
}

.rank-value .value-num {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
}

.rank-value .value-unit {
  font-size: 12px;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .podium {
    grid-template-columns: repeat(3, 1fr);
    padding: 24px 12px;
    gap: 8px;
  }

  .podium-item {
    padding: 16px 8px;
  }

  .podium-item.rank-1 {
    transform: translateY(-12px);
  }

  .podium-avatar {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }

  .podium-name {
    font-size: 13px;
  }

  .podium-value .value-num {
    font-size: 18px;
  }

  .rank-sub {
    gap: 8px;
  }

  .rank-sub span {
    font-size: 11px;
  }
}
</style>
