// pages/date-calculator.js
import DateCalculator from '../components/DateCalculator'
import Head from 'next/head'

export default function DateCalculatorPage() {
  return (
    <>
      <Head>
        <title>Tính Thời Hạn Giấy Tờ - VPCC Nguyễn Thị Như Trang - Nguyễn Tùng Lâm</title>
        <meta name="description" content="Công cụ tính toán thời gian, thời hạn hiệu lực văn bản, ngày làm việc cho văn phòng công chứng" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DateCalculator />
    </>
  )
}
