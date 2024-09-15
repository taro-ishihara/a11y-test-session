// @vitest-environment jsdom

import { expect, test } from 'vitest'
import Bad from './Bad'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import * as matchers from 'jest-extended'

expect.extend(matchers)

render(<Bad />)

test('ショッピングカートボタンが表示されていること', () => {
    expect(screen.getByText('> Items').nextSibling).toBeVisible()
})

test('ショッピングカートボタンはページ内に1つだけ存在すること', () => {
    /// ???
})

test('ショッピングカートボタンはHeaderの中に存在すること', () => {
    /// ???
})

test('Top SalesとNew Itemsに同じ商品が存在すること', async () => {
    const topSales = screen.getByText('- Top Sales -')
    const newItems = screen.getByText('- New Items -')

    // const topSalesItems = within(topSales.nextSibling as HTMLElement)
    // ???
})

test('Top SalesとNew Itemsどちらにも存在する商品の「お気に入り登録」ボタンをクリックすると、どちらにも反映されること', async () => {
    /// ???
})

test('売り切れの商品の「カートに追加」ボタンは機能しないこと', async () => {
    const soldItems = screen.getAllByText('SOLD').map(sold=>sold.previousElementSibling.textContent!) //ts erros
    expect(soldItems.length).toBeGreaterThan(0)
    for (const item of soldItems) {
        const addToCartButton = within(screen.getByText(item).parentElement.parentElement).getByText('Add to Cart')  //ts erros
        await userEvent.click(addToCartButton)
    }

    /// ??? after: before: is not supported..
})

test('「カートに追加」ボタンを押すとカートに商品が追加されること', async ()=>{
    await userEvent.click(screen.getAllByText('Add to Cart')[0])
    
    /// ??? after: before: is not supported..
})