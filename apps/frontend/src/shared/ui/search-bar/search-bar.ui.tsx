export default function SearchBar() {
  return (
     <div className="flex items-center w-full h-full bg-gray-100 rounded-full px-3 py-2 gap-3 focus:outline-none">
            <input 
                className="flex-1"
                key="random1"
                maxLength={60}
                placeholder="뽑기방 검색"

                // onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={()=>{}}
            type='button'                
            className="p-1"
            >
                <img src={'/icons/ic-search.svg'} className="w-5 h-5"/>
            </button>
        </div>
  )
}
