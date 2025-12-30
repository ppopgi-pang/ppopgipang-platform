import ClockIcon from "@/assets/icons/items/ic-clock.svg?react";
import DeleteHistoryIcon from "@/assets/icons/items/ic-delete.svg?react";

export default function HistoryItem({
  onDeleteHistory,
  historyTitle,
}: {
  historyTitle: string;
  onDeleteHistory: () => void;
}) {
  return (
    <li className="w-full p-3 flex items-center">
      <ClockIcon className="mr-3" />
      <span>{historyTitle}</span>
      <button
        type="button"
        className="ml-auto cursor-pointer p-1 text-gray-500"
        onClick={onDeleteHistory}
      >
        <DeleteHistoryIcon />
      </button>
    </li>
  );
}
