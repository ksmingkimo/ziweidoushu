// Auth.js v5 配置
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';

// 暂时用简化配置，后续阶段再完善微信/手机号登录
const providers: Provider[] = [
  Credentials({
    id: 'phone',
    name: '手机号验证码登录',
    credentials: {
      phone: { label: '手机号', type: 'text' },
      code: { label: '验证码', type: 'text' },
    },
    async authorize(credentials) {
      // TODO: 对接阿里云短信验证
      // 第一阶段暂时放行，后续完善
      if (credentials?.phone && credentials?.code) {
        return {
          id: credentials.phone as string,
          phone: credentials.phone as string,
          name: `用户${(credentials.phone as string).slice(-4)}`,
        };
      }
      return null;
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
});
