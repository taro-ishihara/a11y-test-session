// @vitest-environment jsdom

import { expect, test } from 'vitest'
import Good from './Good'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import * as matchers from 'jest-extended'

expect.extend(matchers)

render(<Good />)

test('ショッピングカートボタンが表示されていること', () => {
    expect(screen.getByRole('button', { name: "Shopping Cart" })).toBeVisible() // buttonの中のTextは自動でAccessibleNameになる
})

test('ショッピングカートボタンはページ内に1つだけ存在すること', () => {
    expect(screen.getAllByRole('button', { name: "Shopping Cart" })).toHaveLength(1)
})

test('ショッピングカートボタンはHeaderの中に存在すること', () => {
    expect(screen.getByRole('banner')).toContainElement(screen.getByRole('button', { name: "Shopping Cart" })) // headerやfooterを使って簡単に親子関係を確認することができる
})

test('Top SalesとNew Itemsに同じ商品が存在すること', async () => {
    const topSales = within(screen.getByRole('region', { name: 'Top Sales' })).getAllByRole('listitem') // RegionにAriaでLabel付けをしておけば、sectionをスクリーンリーダーで認識可能になる＝テストでも利用できる
    const newItems = within(screen.getByRole('region', { name: 'New Items' })).getAllByRole('listitem')

    const topSalesSet = new Set(topSales.map(item => within(item).getByRole('heading').textContent)) // 直感的な操作でSetを作れる
    const newItemsSet = new Set(newItems.map(item => within(item).getByRole('heading').textContent))

    expect(topSalesSet.intersection(newItemsSet).size).toBeGreaterThan(0)
})

test('Top SalesとNew Itemsどちらにも存在する商品の「お気に入り登録」ボタンをクリックすると、どちらにも反映されること', async () => {
    const topSalesRegion = screen.getByRole('region', { name: 'Top Sales' })
    const newItemsRegion = screen.getByRole('region', { name: 'New Items' })

    const topSalesItems = within(topSalesRegion).getAllByRole('listitem')
    const newItems = within(newItemsRegion).getAllByRole('listitem')

    const topSalesItemsSet = new Set(topSalesItems.map(item => within(item).getByRole('heading').textContent!))
    const newItemsSet = new Set(newItems.map(item => within(item).getByRole('heading').textContent!))

    const commonItems = topSalesItemsSet.intersection(newItemsSet)
    expect(commonItems.size).toBeGreaterThan(0)

    const getItem = (region: HTMLElement, name: string) => within(region).getByRole('listitem', { name: name })
    const getFavoriteButton = (item: HTMLElement) => within(item).getByRole('button', { name: 'favorite' }) // アイコンボタンでもアクセシビリティ対応してあれば簡単に取得できる
    const getPressedFavoriteButton = (item: HTMLElement) => within(item).getByRole('button', { name: 'favorite', pressed: true }) // Ariaがステータスを保存しているので簡単に特定の状態のボタンを取れる

    await Promise.allSettled(Array.from(commonItems).map(itemName => userEvent.click(getFavoriteButton(getItem(topSalesRegion, itemName)))))
    expect(commonItems.forEach(itemName => {
        expect(getFavoriteButton(getItem(topSalesRegion, itemName))).toHaveAttribute('aria-pressed', 'true')
        expect(getFavoriteButton(getItem(newItemsRegion, itemName))).toHaveAttribute('aria-pressed', 'true')
    }))

    await Promise.allSettled(Array.from(commonItems).map(itemName => userEvent.click(getPressedFavoriteButton(getItem(newItemsRegion, itemName)))))
    expect(commonItems.forEach(itemName => {
        expect(getFavoriteButton(getItem(topSalesRegion, itemName))).toHaveAttribute('aria-pressed', 'false')
        expect(getFavoriteButton(getItem(newItemsRegion, itemName))).toHaveAttribute('aria-pressed', 'false')
    }))
})

test('売り切れの商品の「カートに追加」ボタンは機能しないこと', async () => {
    const soldItems = screen.getAllByRole('listitem', { description: /SOLD/ })
    expect(soldItems.length).toBeGreaterThan(0)
    for (const item of soldItems) {
        const addToCartButton = within(item).getByRole('button', { name: 'Add to Cart' })
        expect(addToCartButton).toHaveAttribute('aria-disabled', 'true')
        await userEvent.click(addToCartButton)
    }

    expect(screen.getByRole('button', { name: "Shopping Cart" })).not.toHaveAccessibleDescription(new RegExp('^\\d+ items in the cart$')) 
    // 視覚だけでなくAccessibility対応しているのでそれを使ってテストできる（逆に言えばテストできないならスクリーンリーダーは見えてないことになる
})

test('「カートに追加」ボタンを押すとカートに商品が追加されること', async ()=>{
    const validAddToCartButtons = screen.getAllByRole('button', {name: 'Add to Cart'}).filter(element=>element.ariaDisabled === null) // AriaでFilterできる
    expect(validAddToCartButtons.length).toBeGreaterThan(0)
    for(const button of validAddToCartButtons){
        await userEvent.click(button)
    }

    expect(screen.getByRole('button', { name: "Shopping Cart" })).toHaveAccessibleDescription(`${validAddToCartButtons.length} items in the cart`)
})