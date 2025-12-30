import { useState } from "react";
import History from "./history";
import { SearchBar } from "./search-bar";
import GoBackButton from "@/components/common/buttons/go-back-button";
import FullScreenModal from "@/components/common/modal/full-screen-modal";

export default function SearchModal({
  isOpen,
  onClose,
  onSelectPlace,
  selectedPlace,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlace: (place: string) => void;
  selectedPlace: string;
}) {
  const [searchText, setSearchText] = useState(selectedPlace);

  const handleSelectPosition = (newPlace: string) => {
    if (newPlace) {
      onSelectPlace(newPlace);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <FullScreenModal>
      <section className="w-full h-full flex flex-col">
        <header className="w-full px-4 py-3 bg-white border-b border-gray-200 flex items-center gap-3">
          <GoBackButton onClick={onClose} />
          <SearchBar
            value={searchText}
            onChange={(newPlace) => {
              setSearchText(newPlace);
            }}
            placeholder="지역명, 가게명 검색"
            onSearch={handleSelectPosition}
          />
        </header>
        <History />
      </section>
    </FullScreenModal>
  );
}
