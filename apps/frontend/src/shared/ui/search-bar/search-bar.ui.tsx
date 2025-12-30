export default function SearchBarButton({
  onClick,
  searchedPlace,
}: {
  onClick: () => void;
  searchedPlace: string | undefined;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full px-3 bg-white rounded-full h-12 gap-3 shadow-lg border-2 border-transparent cursor-pointer"
    >
      {searchedPlace ? (
        <span>{searchedPlace}</span>
      ) : (
        <>
          <span className="flex flex-1 text-gray-500 items-center">
            지역명, 가게명 검색
          </span>
          <img src="/icons/ic-search.svg" className="w-5 h-5" alt="" />
        </>
      )}
    </button>
  );
}
