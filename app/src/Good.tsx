import { useId, useReducer } from 'react'
import { ShoppingCartIcon, StarIcon } from 'lucide-react';
import classNames from 'classnames';

export type CartAction =
  | { type: "ADD_ITEM"; payload: { item: string } }
  | { type: "REMOVE_ITEM"; payload: { item: string } };

const cartReducer = (state: string[], action: CartAction) => {
  switch (action.type) {
    case "ADD_ITEM":
      return [...state, action.payload.item];

    case "REMOVE_ITEM":
      return state.filter((item) => item !== action.payload.item);

    default:
      return state;
  }
};

export type FavoriteAction =
  | { type: "TOGGLE_FAVORITE"; payload: { item: string } }

const favoriteReducer = (state: String[], action: FavoriteAction) => {
  switch (action.type) {
    case 'TOGGLE_FAVORITE':
      if (state.includes(action.payload.item)) {
        return state.filter(favoriteItem => favoriteItem !== action.payload.item);
      } else {
        return [...state, action.payload.item];
      }
    default:
      return state;
  }
};

function Good() {
  const [cartItems, dispatchCart] = useReducer(cartReducer, []);
  const [favoriteItems, dispatchFavorite] = useReducer(favoriteReducer, []);

  const topSalesId = useId()
  const newItemsId = useId()
  const cartLabelId = useId()
  const cartDescriptionId = useId()

  return (
    <div className='p-4 space-y-4 focus-visible:ring-2 focus-visible:ring-amber-500'>
      <nav className='flex justify-between'>
        <div className='flex gap-2'>
          <div>Logo</div>
          <a href='/items' className='underline'>Items</a>
          <a href='/purchase-history' className='underline focus-visible:ring '>History</a>
        </div>
        <div className='flex gap-4'>
          <p>Your Name</p>
          <button type='button'>Logout</button>
        </div>
      </nav>
      <header className='flex justify-between items-center'>
        <p className='text-2xl tracking-wider font-medium'><span aria-hidden className='mr-2'>{'>'}</span><span>Items</span></p>
        <button type='button' aria-labelledby={cartLabelId} aria-describedby={cartDescriptionId} className={classNames('relative outline outline-1 rounded p-1', {
          'after:absolute after:-top-1.5 after:-right-1.5 after:rounded-full after:h-3 after:w-3 after:bg-green-500/90': cartItems.length > 0
        })}>
          <ShoppingCartIcon aria-hidden className='h-5 w-5 text-slate-700' />
          <span id={cartLabelId} className='sr-only'>Shopping Cart</span>
          {cartItems.length > 0 && <span id={cartDescriptionId} aria-live='polite' className='sr-only'>{`${cartItems.length} items in the cart`}</span>}
        </button>
      </header>
      <main className='space-y-8'>
        <section title='Top Sales' aria-labelledby={topSalesId}>
          <h1 id={topSalesId} className='mb-4 text-center text-xl space-x-2'><span aria-hidden>-</span><span>Top Sales</span><span aria-hidden>-</span></h1>
          <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
            <ItemCard name='Potion' price={200} updatedAt={new Date('1991-10-25')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Potion')} dispatchFavorite={dispatchFavorite} />
            <ItemCard name='High Potion' price={1000} updatedAt={new Date('2005-09-01')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('High Potion')} dispatchFavorite={dispatchFavorite} isSoldOut />
            <ItemCard name='Elixir' price={1500000} updatedAt={new Date('2004-05-22')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Elixir')} dispatchFavorite={dispatchFavorite} />
            <ItemCard name='Iron Sword' price={200} updatedAt={new Date('1955-04-22')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Iron Sword')} dispatchFavorite={dispatchFavorite} />
            <ItemCard name='Super Ultra Hyper Amazing Weapon' price={9999999999} updatedAt={new Date('2024-10-14')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Super Ultra Hyper Amazing Weapon')} dispatchFavorite={dispatchFavorite} />
            <ItemCard name='Stone' price={1} updatedAt={new Date('1900-01-01')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Stone')} dispatchFavorite={dispatchFavorite} />
          </ul>
        </section>
        <section title='New Items' aria-labelledby={newItemsId}>
          <h1 id={newItemsId} className='mb-4 text-center text-xl space-x-2'><span aria-hidden='true'>-</span><span>New Items</span><span aria-hidden>-</span></h1>
          <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
            <ItemCard name='Super Ultra Hyper Amazing Weapon' price={9999999999} updatedAt={new Date('2024-10-14')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Super Ultra Hyper Amazing Weapon')} dispatchFavorite={dispatchFavorite} />
            <ItemCard name='Plasma Lifle' price={19000000} updatedAt={new Date('2024-10-05')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Plasma Lifle')} dispatchFavorite={dispatchFavorite} />
            <ItemCard name='Optical Camouflage' price={76000000} updatedAt={new Date('2024-10-01')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Optical Camouflage')} dispatchFavorite={dispatchFavorite} />
          </ul>
        </section>
      </main>
      <footer className="mt-8 flex justify-end gap-2 text-sm text-slate-500 underline">
        <p>Terms of Service</p>
        <p>Privacy Policy</p>
        <p>Contact Us</p>
      </footer>
    </div>
  )
}

const ItemCard = ({ name, price, updatedAt, dispatchCart, isFavorite, dispatchFavorite, isSoldOut }: {
  name: string
  price: number
  updatedAt: Date
  dispatchCart: React.Dispatch<CartAction>
  isFavorite: boolean
  dispatchFavorite: React.Dispatch<FavoriteAction>
  isSoldOut?: boolean
}) => {
  const nameId = useId();
  const statusId = useId();
  const priceId = useId();

  return <li aria-labelledby={nameId} aria-describedby={[statusId, priceId].join(' ')}
      className='bg-slate-50 px-3 py-2 outline outline-2 -outline-offset-1 outline-slate-700 rounded shadow grid grid-rows-subgrid row-span-2 grid-cols-2 gap-2'>
      <div className="flex">
          <h1 id={nameId} className={classNames("font-medium text-lg", { 'line-through': isSoldOut })}>{name}</h1>
          {isSoldOut && <p id={statusId} className="text-red-600 ml-2 text-sm">SOLD</p>}
      </div>
      <p id={priceId} className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)}</p>
      <p>
          <span className='text-xs after:content-[":"] after:ml-[1px] after:mr-0.5'>Updated</span>
          <time dateTime={updatedAt.toISOString().split('T')[0]} className="text-sm">{updatedAt.toLocaleDateString()}</time>
      </p>
      <div className="flex justify-end gap-2">
          <button type='button' aria-disabled={isSoldOut} onClick={() => {
              if (isSoldOut) return
              dispatchCart({
                  type: "ADD_ITEM",
                  payload: {
                      item: name
                  }
              })
          }} className={classNames("rounded text-center text-white bg-indigo-700 w-32", {
              "!bg-slate-500 text-slate-200 pointer-events-none cursor-auto": isSoldOut
          })
          }>Add to Cart</button>
          <button type='button' aria-pressed={isFavorite} onClick={() => dispatchFavorite({
              type: "TOGGLE_FAVORITE", payload: {
                  item: name
              }
          })} className="group outline outline-1 -outline-offset-1 outline-slate-700 p-1 rounded">
              <StarIcon aria-label="favorite" className="h-4 w-4 text-slate-700 group-aria-pressed:fill-yellow-300 group-aria-pressed:text-yellow-500" />
          </button>
      </div>
  </li>
}

export default Good
