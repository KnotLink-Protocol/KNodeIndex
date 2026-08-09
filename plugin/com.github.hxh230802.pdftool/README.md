# PDF 工具 (PdfTool)

功能全面的 PDF 处理服务，支持页面编辑、格式转换、表单填写、文本标注、元数据管理、数字签名、OCR、AI 分析等 58 种操作。

## 节点信息

- **AppID**: `com.github.hxh230802.pdftool`
- **类型**: 插入式 (plugin)
- **作者**: HXH
- **版本**: v1.0.0

## 接口列表

| Socket | 操作 |
|--------|------|
| pages | merge, split, extract, rotate, reorder, insert, remove, optimize |
| convert | images-to-pdf, export |
| form | get-fields, fill, fill-any, create-form, get-form-templates, create-from-template, flatten, clear-fields, detect-fields |
| text | add-annotation, update-annotation, remove-annotation, remove-annotations, redact, page-numbers, bates-numbering, watermark, highlight, date-stamp, add-comment, update-comment, remove-comment |
| extract | extract-text, extract-text-blocks, extract-tables, extract-images, extract-links, detect-barcodes |
| metadata | get-metadata, set-metadata, sanitize-metadata, detect-type |
| sign | verify-signatures, sign, sign-pem, add-signature-image, update-signature-image, remove-signature-image |
| security | encrypt, detect-pii |
| ocr | get-ocr-languages, get-image-info |
| ai | get-llm-info, auto-fill-form, extract-data, analyze-content |
| batch | compare, batch-process |

## 下载

- [GitHub Releases](https://github.com/KnotLink-Nodes/PdfTool/releases/latest)
- [KnotLink 节点市场](https://knotlink.cn/nodes)

## 依赖

- Python 3.10+
- pymupdf / pypdf
- Tesseract (OCR 可选)
- LLM 后端 (AI 功能可选，支持 Ollama / OpenAI)
