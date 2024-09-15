import { useReducer } from 'react'
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

  return (
    <div className='p-4 space-y-4 focus-visible:ring-2 focus-visible:ring-amber-500'>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <div>Logo</div>
          <div className='underline'>Items</div>
          <div className='underline focus-visible:ring '>History</div>
        </div>
        <div className='flex gap-4'>
          <div>Your Name</div>
          <div>Logout</div>
        </div>
      </div>
      <div className='flex justify-between items-center'>
        <div className='text-2xl tracking-wider font-medium'>{'> Items'}</div>
        <div className={classNames('relative outline outline-1 rounded p-1', {
          'after:absolute after:-top-1.5 after:-right-1.5 after:rounded-full after:h-3 after:w-3 after:bg-green-500/90': cartItems.length > 0
        })}>
          <ShoppingCartIcon className='h-5 w-5 text-slate-700' />
        </div>
      </div>
      <div className='space-y-8'>
        <div>
          <div className='mb-4 text-center text-xl space-x-2'>{'- Top Sales -'}</div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
            <ItemCard name='Potion' price={200} updatedAt={new Date('1991-10-25')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Potion')} dispatchFavorite={dispatchFavorite} />
            <ItemCard name='High Potion' price={1000} updatedAt={new Date('2005-09-01')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('High Potion')} dispatchFavorite={dispatchFavorite} isSoldOut />
            <ItemCard name='Elixir' price={1500000} updatedAt={new Date('2004-05-22')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Elixir')} dispatchFavorite={dispatchFavorite} />
            <ItemCard name='Iron Sword' price={200} updatedAt={new Date('1955-04-22')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Iron Sword')} dispatchFavorite={dispatchFavorite} />
            <ItemCard name='Super Ultra Hyper Amazing Weapon' price={9999999999} updatedAt={new Date('2024-10-14')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Super Ultra Hyper Amazing Weapon')} dispatchFavorite={dispatchFavorite} />
            <ItemCard name='Stone' price={1} updatedAt={new Date('1900-01-01')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Stone')} dispatchFavorite={dispatchFavorite} />
          </div>
        </div>
        <div>
          <div className='mb-4 text-center text-xl space-x-2'>{'- New Items -'}</div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
            <ItemCard name='Super Ultra Hyper Amazing Weapon' price={9999999999} updatedAt={new Date('2024-10-14')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Super Ultra Hyper Amazing Weapon')} dispatchFavorite={dispatchFavorite} />
            <ItemCard name='Plasma Lifle' price={19000000} updatedAt={new Date('2024-10-05')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Plasma Lifle')} dispatchFavorite={dispatchFavorite} />
            <ItemCard name='Optical Camouflage' price={76000000} updatedAt={new Date('2024-10-01')} dispatchCart={dispatchCart} isFavorite={favoriteItems.includes('Optical Camouflage')} dispatchFavorite={dispatchFavorite} />
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-2 text-sm text-slate-500 underline">
        <div>Terms of Service</div>
        <div>Privacy Policy</div>
        <div>Contact Us</div>
      </div>
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
  return <div
      className='bg-slate-50 px-3 py-2 outline outline-2 -outline-offset-1 outline-slate-700 rounded shadow grid grid-rows-subgrid row-span-2 grid-cols-2 gap-2'>
      <div className="flex">
          <div className={classNames("font-medium text-lg", { 'line-through': isSoldOut })}>{name}</div>
          {isSoldOut && <p className="text-red-600 ml-2 text-sm">SOLD</p>}
      </div>
      <div className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)}</div>
      <div>
          <span className='text-xs after:content-[":"] after:ml-[1px] after:mr-0.5'>Updated</span>
          <span className="text-sm">{updatedAt.toLocaleDateString()}</span>
      </div>
      <div className="flex justify-end gap-2">
          <div onClick={() => {
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
          }>Add to Cart</div>
          <div onClick={() => dispatchFavorite({
              type: "TOGGLE_FAVORITE", payload: {
                  item: name
              }
          })} className="group outline outline-1 -outline-offset-1 outline-slate-700 p-1 rounded">
              <StarIcon className={classNames("h-4 w-4 text-slate-700",
              {
                "fill-yellow-300 text-yellow-500": isFavorite
              })} />
          </div>
      </div>
  </div>
}

export default Good
