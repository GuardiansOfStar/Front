import Background from "../../components/ui/Background";
import React, { useState } from "react";

const Memory = () => {
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

    const toggleSelection = (index: number) => {
        setSelectedIndexes((prev) =>
        prev.includes(index)
            ? prev.filter((i) => i !== index)
            : [...prev, index]
        );
    };

    const options = [
        { img: "/assets/images/next_button.png", label: "안전모 쓰기" },
        { img: "/assets/images/next_button.png", label: "구덩이 피하기" },
        { img: "/assets/images/next_button.png", label: "막걸리 치우기" },
        { img: "/assets/images/next_button.png", label: "무거운 짐 실기" },
        { img: "/assets/images/next_button.png", label: "귀가시간 정하기" },
    ];

    const topRow = options.slice(0, 2);
    const bottomRow = options.slice(2);

    const renderCard = (option: any, index: number) => {
        const isSelected = selectedIndexes.includes(index);

        return (
        <div
            key={index}
            onClick={() => toggleSelection(index)}
            className={`flex flex-col items-center bg-white rounded-xl p-4 cursor-pointer transition
            border-8 ${
                isSelected ? "border-red-500" : "border-transparent"
            } shadow-md`}
        >
            <img
            src={option.img}
            alt={option.label}
            className="w-[200px] h-[150px] object-cover mb-4"
            />
            <span className="text-xl font-semibold text-gray-800">
            {option.label}
            </span>
        </div>
        );
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-start bg-[#FFFDEB] py-10 px-4">
        <h1 className="text-[70px] font-bold text-[#0E8E12] text-center mb-16">
            가장 기억에 남는 장면을 골라주세요
        </h1>

        {/* 윗줄 2개 */}
        <div className="flex justify-center gap-16 mb-10">
            {topRow.map((option, idx) => renderCard(option, idx))}
        </div>

        {/* 아랫줄 3개 */}
        <div className="flex justify-center gap-10">
            {bottomRow.map((option, idx) => renderCard(option, idx + 2))}
        </div>
        </div>
    );
};

export default Memory;
