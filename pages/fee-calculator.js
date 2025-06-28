// pages/fee-calculator.js
import UnifiedFeeCalculator from '../components/UnifiedFeeCalculator'
import Head from 'next/head'

export default function FeeCalculator() {
  return (
    <>
      <Head>
        <title>Công Cụ Tính Phí Công Chứng - VPCC Nguyễn Thị Như Trang - Nguyễn Tùng Lâm</title>
        <meta name="description" content="Công cụ tính phí dịch thuật, công chứng, chứng thực và cấp bản sao văn bản công chứng" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UnifiedFeeCalculator />
    </>
  )
}
