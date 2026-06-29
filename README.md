# 桃園捷運司機員心理測驗模擬網頁 
[<a href="https://hanafeng2021.github.io/taoyuan_metro_psych_test_web/">測試開始</a> ]
本專案為繁體中文原創模擬題庫，協助準備桃園捷運司機員甄試的心理測驗與人格測驗方向。

## 檔案說明

- `questions.json`：約 500 題原創模擬題，包含分類、題目、五點量表選項、是否反向題。
- `index.html`：主畫面。
- `app.js`：載入題庫、分類篩選、作答、計分、結果匯出。
- `style.css`：版面與 RWD 樣式。
- `README.md`：使用說明。

## 使用方式

1. 將全部檔案放在同一個資料夾。
2. 建議用本機伺服器開啟，避免瀏覽器阻擋 `fetch("questions.json")`。

### 方法一：使用 Python

```bash
python -m http.server 8000
```

開啟瀏覽器：

```text
http://localhost:8000
```

### 方法二：使用 VS Code

安裝 Live Server 外掛，右鍵 `index.html`，選擇 **Open with Live Server**。

## 題庫分類

包含責任感、安全意識、遵守 SOP、情緒穩定、壓力承受、專注與細心、團隊合作、誠信人格、服務態度、風險判斷、工作紀律、學習適應、情境判斷等。

## 注意事項

本題庫為原創練習內容，並非桃園捷運公司官方心理測驗試題，也不保證錄取。正式測驗請依真實狀況作答，避免刻意迎合造成前後矛盾。
