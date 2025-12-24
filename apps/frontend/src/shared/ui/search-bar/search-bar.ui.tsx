export default function SearchBar() {
  return (
    <div className="flex items-center w-full px-3 bg-white rounded-full h-12 gap-3 shadow-lg border-2 border-transparent focus-within:border-2 focus-within:border-blue-300 text-gray-800">
      <input
        className="flex-1 focus:outline-0 placeholder:text-gray-500"
        key="random1"
        maxLength={60}
        placeholder="뽑기방 검색"
      />
      <button onClick={() => {}} type="button" className="p-1">
        <img src={"/icons/ic-search.svg"} className="w-5 h-5" />
      </button>
    </div>
  );
}
