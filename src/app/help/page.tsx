import type { Metadata } from 'next';
import AnimatedTutorial from '@/components/guide/AnimatedTutorial';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '帮助中心 - 紫微君',
  description: '紫微君使用教程，手把手教你排盘、AI解读、合盘分析、每日运势',
};

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">帮助中心</h1>
      <p className="text-center text-gray-500 mb-10">
        快速上手紫微君，了解所有功能
      </p>

      {/* 动画教程 */}
      <section className="mb-16 bg-white rounded-2xl border p-6 lg:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          📱 30 秒快速了解
        </h2>
        <AnimatedTutorial />
      </section>

      {/* 详细教程 */}
      <div className="space-y-12">
        <Section
          icon="🔮"
          title="什么是紫微君？"
          anchor="about"
        >
          <p>
            紫微君是一款基于<strong>AI 大模型</strong>的紫微斗数命理应用。
            你只需要输入出生时间，系统会自动排出完整的紫微斗数命盘，
            AI 会像一位温暖专业的大师一样，为你解读性格、事业、感情、财运等方方面面。
          </p>
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            <li>✅ 输入出生时间 → 秒出完整命盘</li>
            <li>✅ AI 流式解读 → 像真人在对话</li>
            <li>✅ 通俗易懂 → 零基础也能理解</li>
            <li>✅ 每日运势 → 结合命盘精准推算</li>
          </ul>
        </Section>

        <Section
          icon="📝"
          title="如何排盘？"
          anchor="chart"
        >
          <ol className="space-y-3 text-sm text-gray-700">
            <li>
              <strong>1. 进入排盘页</strong>
              <p className="text-gray-500 mt-0.5">点击首页「开始排盘」按钮，或在导航栏选择「开始排盘」。</p>
            </li>
            <li>
              <strong>2. 填写出生信息</strong>
              <p className="text-gray-500 mt-0.5">
                输入你的公历出生日期（年/月/日）和出生时间（24小时制）。
                系统会自动转换为农历和时辰（如 12:00 → 午时）。
              </p>
            </li>
            <li>
              <strong>3. 选择性别</strong>
              <p className="text-gray-500 mt-0.5">
                性别会影响命宫起法和行运方向（阳男阴女顺行，阴男阳女逆行），务必正确选择。
              </p>
            </li>
            <li>
              <strong>4. 点击「开始排盘」</strong>
              <p className="text-gray-500 mt-0.5">
                系统瞬间计算并展示你的完整命盘，包括十二宫、十四主星、辅星、四化等。
              </p>
            </li>
            <li>
              <strong>5. 查看详情</strong>
              <p className="text-gray-500 mt-0.5">
                点击命盘中的任意宫位，可以查看该宫的星曜详情。点击「查看详细解读」进入 AI 解读页。
              </p>
            </li>
          </ol>
        </Section>

        <Section
          icon="🤖"
          title="AI 解读怎么用？"
          anchor="reading"
        >
          <ol className="space-y-3 text-sm text-gray-700">
            <li>
              <strong>1. 选择解读类型</strong>
              <p className="text-gray-500 mt-0.5">
                左侧列出了 8 种解读类型：本命盘、命宫详解、夫妻宫、财帛宫、事业宫、大限运势、流年运势、流月运势。
                点击即可切换。
              </p>
            </li>
            <li>
              <strong>2. 点击「开始 AI 解读」</strong>
              <p className="text-gray-500 mt-0.5">
                AI 会以流式输出的方式逐字生成解读内容，就像真人在跟你对话。
              </p>
            </li>
            <li>
              <strong>3. 解读内容结构</strong>
              <p className="text-gray-500 mt-0.5">
                每篇解读包含：总体概述 → 详细分析 → 关键建议 → 温馨提示。
                使用 Markdown + Emoji 增强可读性。
              </p>
            </li>
            <li>
              <strong>4. 解读记录自动保存</strong>
              <p className="text-gray-500 mt-0.5">
                每次解读完成后会自动保存在浏览器中，可在「个人中心」或「解读历史」中随时回顾。
              </p>
            </li>
          </ol>
        </Section>

        <Section
          icon="📊"
          title="每日运势怎么看？"
          anchor="daily"
        >
          <p className="text-sm text-gray-700 mb-3">
            每日运势不是随机生成的结果，而是基于<strong>真实日干支 + 你的命盘</strong>推算出来的：
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <strong>🌟 日四化叠加</strong> — 每天有一个天干，对应四化（禄权科忌），这四个化星会落到你命盘的特定宫位。
            </li>
            <li>
              <strong>📈 五维评分</strong> — 综合运势、财运、事业、感情、健康五个方面，各有一个 0-100 的分数。
            </li>
            <li>
              <strong>🎯 因人而异</strong> — 同一日期，不同命盘的人看到的运势完全不同，因为是结合了你的命盘推算的。
            </li>
            <li>
              <strong>🍀 幸运指南</strong> — 每天提供幸运色、幸运数字、速配生肖，基于日支的传统五行映射。
            </li>
          </ul>
          <p className="mt-3 text-xs text-gray-400">
            ⚠️ 需要先在「排盘」页输入出生信息并生成命盘，才能查看个性化每日运势。
          </p>
        </Section>

        <Section
          icon="💑"
          title="合盘分析怎么用？"
          anchor="compatibility"
        >
          <p className="text-sm text-gray-700 mb-3">
            合盘功能帮你分析<strong>两个人的性格契合度和关系走势</strong>，适合情侣、夫妻或任何你关心的人。
          </p>
          <ol className="space-y-2 text-sm text-gray-700">
            <li>
              <strong>1. 本人信息自动填入</strong>
              <p className="text-gray-500 mt-0.5">如果你之前已经排过盘，本人的出生信息会自动读取，无需重复填写。</p>
            </li>
            <li>
              <strong>2. 填写对方信息</strong>
              <p className="text-gray-500 mt-0.5">输入对方的出生年月日、时间和性别，点击「计算命盘」。</p>
            </li>
            <li>
              <strong>3. 查看命盘摘要</strong>
              <p className="text-gray-500 mt-0.5">排盘完成后，双方卡片的底部会显示命宫、五行局和夫妻宫主星，方便快速对比。</p>
            </li>
            <li>
              <strong>4. AI 合盘解读</strong>
              <p className="text-gray-500 mt-0.5">
                点击「AI 合盘解读」，系统从四个维度分析：
                <span className="block mt-1 space-x-2">
                  <span className="inline-block bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded">性格契合度</span>
                  <span className="inline-block bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded">感情模式</span>
                  <span className="inline-block bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded">优势与挑战</span>
                  <span className="inline-block bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded">相处建议</span>
                </span>
              </p>
            </li>
          </ol>
        </Section>

        <Section
          icon="💳"
          title="费用说明"
          anchor="payment"
        >
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            {[
              { name: '单次解读', price: '¥1', desc: '适合初次体验', count: '1次' },
              { name: '5次套餐', price: '¥3', desc: '每次仅 ¥0.6', count: '5次', popular: true },
              { name: '10次套餐', price: '¥5', desc: '每次仅 ¥0.5', count: '10次' },
            ].map(pkg => (
              <div
                key={pkg.name}
                className={`rounded-xl border-2 p-4 text-center ${
                  pkg.popular ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                }`}
              >
                {pkg.popular && (
                  <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">推荐</span>
                )}
                <p className="font-bold text-gray-800 mt-1">{pkg.name}</p>
                <p className="text-3xl font-bold text-purple-700 my-2">{pkg.price}</p>
                <p className="text-xs text-gray-500">{pkg.count} · {pkg.desc}</p>
              </div>
            ))}
          </div>
          <ul className="mt-4 space-y-1 text-sm text-gray-600">
            <li>✅ <strong>3 次免费试用</strong> — 新用户有 3 次免费解读机会，无需付费</li>
            <li>✅ <strong>支付宝扫码支付</strong> — 支持支付宝当面付，安全便捷</li>
            <li>✅ <strong>次数永久有效</strong> — 购买的次数不会过期</li>
          </ul>
        </Section>

        <Section
          icon="❓"
          title="常见问题"
          anchor="faq"
        >
          <div className="space-y-4 text-sm">
            <FaqItem
              q="出生时间不精确怎么办？"
              a="如果只知道大概几点，选一个最接近的即可。时辰是按两小时一个区间划分的（如 11:00-12:59 → 午时），一般误差在 1-2 小时内影响不大。"
            />
            <FaqItem
              q="这个准吗？"
              a="紫微斗数是中国传统的命理学术，紫微君的核心算法参考了多种经典文献和开源项目。AI 解读结合了现代心理学视角，建议将其视为自我认知的参考工具，而非绝对的预测。"
            />
            <FaqItem
              q="解读记录会被保存吗？"
              a="解读记录保存在你的浏览器中（sessionStorage），不会上传到服务器。如果你清除浏览器数据或使用无痕模式，记录会丢失。"
            />
            <FaqItem
              q="为什么我的命盘和 X 软件的命盘不一样？"
              a="不同软件的排盘可能在节气分月、闰月处理、五星变曜等细节上有差异。紫微君使用的是最主流的算法标准。如有疑问欢迎反馈。"
            />
            <FaqItem
              q="支持农历日期输入吗？"
              a="目前只支持公历输入，系统会自动转换为农历。如果你只知道农历日期，可以用手机自带的日历 App 查到对应的公历日期。"
            />
            <FaqItem
              q="支付支持微信吗？"
              a="目前只支持支付宝当面付。支付宝生成的二维码可以用支付宝 App 扫码支付。如果微信急需，后续会考虑接入。"
            />
          </div>
        </Section>
      </div>

      {/* 底部 CTA */}
      <div className="mt-16 text-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-10 text-white">
        <h2 className="text-2xl font-bold mb-2">准备好了吗？</h2>
        <p className="text-purple-200 mb-6">输入出生信息，开启你的紫微斗数探索之旅</p>
        <Link
          href="/chart"
          className="inline-block bg-white text-purple-700 font-semibold px-8 py-3 rounded-full hover:bg-purple-50 transition-colors"
        >
          开始排盘 ✨
        </Link>
      </div>
    </div>
  );
}

// ---- 子组件 ----

function Section({
  icon,
  title,
  anchor,
  children,
}: {
  icon: string;
  title: string;
  anchor: string;
  children: React.ReactNode;
}) {
  return (
    <section id={anchor}>
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      <div className="bg-white rounded-xl border p-5">{children}</div>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group">
      <summary className="cursor-pointer font-medium text-gray-800 hover:text-purple-700 transition-colors list-none flex items-center gap-2">
        <span className="text-purple-400 group-open:rotate-90 transition-transform text-xs">▶</span>
        {q}
      </summary>
      <p className="mt-2 ml-5 text-gray-600 leading-relaxed">{a}</p>
    </details>
  );
}
