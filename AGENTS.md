# AGENTS.md
# gas-remaining-tool
# 作成日: 2026-04-15
# 対象AI: Codex（実装担当）

## あなたの役割

このファイルを読んだAIは、spec.mdに従ってgas-remaining-toolを実装する。
設計・仕様の変更は行わない。不明点があれば実装を止めて質問する。

## 最重要ルール

- spec.mdが唯一の仕様。spec.mdに書いていないことは実装しない。
- specに曖昧な点がある場合は推測実装せず、質問してから進める。
- 動作するコードを理由なく変更しない。
- 1タスクずつ完結させる。

## 実装順序

1. プロジェクト初期化（Vite + React）
2. vite.config.jsにbase URL設定（/gas-remaining-tool/）
3. GitHub Actions（deploy-pages.yml）作成
4. UnitToggle.jsx（単位切替）
5. VolumeInput.jsx（容器サイズ：ボタン＋手入力）
6. FillPressureInput.jsx（充填圧力：14.7 / 19.6 の2択ボタン）
7. CurrentPressureSlider.jsx（スライダー＋リアルタイム数値表示）
8. FlowRateInput.jsx（流量：ボタン＋手入力）
9. 計算ロジック（App.jsx内に実装）
10. ResultDisplay.jsx（残量・時間・警告色・注意書き）
11. localStorage保存・復元
12. 動作確認・バグ修正

## 計算式

### MPa表記
残量(L) = 内容積(L) × 現在圧力(MPa) × 10
使用可能時間(分) = 残量(L) ÷ 流量(L/分)

### kgf/cm²表記
残量(L) = 内容積(L) × 現在圧力(kgf/cm²)
使用可能時間(分) = 残量(L) ÷ 流量(L/分)

## 警告色

const ratio = currentPressure / fillPressure;
ratio > 0.5  → 緑（normal）
ratio > 0.3  → 黄（warning）
ratio <= 0.3 → 赤（danger）

## 禁止事項

- spec.mdに記載のない機能の追加
- 外部APIの使用
- 外部UIライブラリの導入
- フェーズ2項目の先行実装
