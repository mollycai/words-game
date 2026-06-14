import * as XLSX from 'xlsx'
import type { WordPair } from '@/types'

export interface ParseResult {
  pairs: WordPair[]
  total: number
}

export interface ParseError {
  error: string
}

const TEMPLATE_HEADER = ['word', 'Meaning']
const TEMPLATE_SAMPLES = [
  ['apple', 'n. 苹果'],
  ['abandon', 'v. 放弃'],
  ['book', 'n. 书'],
  ['cat', 'n. 猫'],
  ['chair', 'n. 椅子'],
  ['dog', 'n. 狗'],
]

/** Generate and download an Excel template file for teachers to fill in */
export function downloadTemplate(): void {
  const sheet = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADER, ...TEMPLATE_SAMPLES])
  // Set column widths for readability
  sheet['!cols'] = [{ wch: 16 }, { wch: 16 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, sheet, '单词表')
  XLSX.writeFile(wb, '单词表模板.xlsx')
}

export function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        if (!sheetName) {
          reject({ error: '文件中没有找到工作表' })
          return
        }
        const sheet = workbook.Sheets[sheetName]
        const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })

        const headerTexts = new Set(['word', 'meaning', '英文', '单词', 'english', '中文', '释义', 'chinese'])
        const pairs: WordPair[] = []
        for (let i = 0; i < rows.length; i++) {
          // Always skip the first row (header)
          if (i === 0) continue
          const row = rows[i]
          if (!row || row.length < 2) continue
          const english = String(row[0] ?? '').trim()
          const chinese = String(row[1] ?? '').trim()
          if (!english || !chinese) continue
          if (headerTexts.has(english.toLowerCase())) continue
          pairs.push({ id: `wp_${i}`, english, chinese })
        }

        if (pairs.length === 0) {
          reject({ error: '文件中没有解析到有效的单词数据' })
          return
        }
        if (pairs.length < 10) {
          reject({ error: `仅解析到 ${pairs.length} 个单词，请上传包含至少 10 个单词的单词表` })
          return
        }
        resolve({ pairs, total: pairs.length })
      } catch {
        reject({ error: '文件解析失败，请上传 .xlsx 或 .xls 文件' })
      }
    }
    reader.onerror = () => reject({ error: '文件读取失败' })
    reader.readAsArrayBuffer(file)
  })
}
