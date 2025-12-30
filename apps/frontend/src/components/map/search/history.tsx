import HistoryItem from "./history-item";

export default function History() {
  return (
    <div className="w-full flex-1 bg-gray-50 p-3 flex flex-col">
      <div className="w-full flex items-center justify-between p-3">
        <h2 className="text-sm inline-block">최근 검색어</h2>
        <button className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
          전체 삭제
        </button>
      </div>
      <ol className="w-full flex flex-col text-gray-700 text-sm">
        <HistoryItem historyTitle="강남역" onDeleteHistory={() => {}} />
        <HistoryItem historyTitle="강남역" onDeleteHistory={() => {}} />
        <HistoryItem historyTitle="강남역" onDeleteHistory={() => {}} />
      </ol>
    </div>
  );
}
