/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',  // Googleのプロフィール画像ドメイン
      'avatars.githubusercontent.com'  // 将来GitHubログインを追加する場合用
    ],
  },
}

module.exports = nextConfig