# TeleTuner 🎸

高精度音声解析エンジン搭載のWEBギターチューナー

## 特徴

- 🎯 **高精度チューニング**: Web Audio APIとFFT解析による±0.5セントの精度
- 🔍 **弦の自動識別**: AI音色解析による自動弦判定
- 🎨 **美しいUI**: Telecasterヘッドストックをモチーフにしたデザイン
- 📱 **PWA対応**: スマートフォンにインストール可能
- 🌐 **認証不要**: アクセスするだけで即座に利用開始

## 技術スタック

- **フロントエンド**: React 18 + TypeScript + Vite
- **スタイリング**: Tailwind CSS + Framer Motion
- **音声処理**: Web Audio API + Custom DSP Library
- **状態管理**: Zustand
- **PWA**: Vite PWA Plugin

## デプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/teletuner)

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

## 使用方法

1. アプリにアクセス
2. マイクの使用を許可
3. 「チューニング開始」ボタンをクリック
4. ギターを弾いて自動チューニング開始

## 対応チューニング

- 標準チューニング (EADGBE)
- ドロップD (DADGBE)  
- 半音下げ (E♭A♭D♭G♭B♭E♭)

## ライセンス

MIT License