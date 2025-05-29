import Background from '../../components/ui/Background';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const allRegions = ['보성군', '보라색', '보라카이', '담양군', '강릉시', '강력반', '해남군', '목포시'];

const SettingPage = () => {
    const [inputValue, setInputValue] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const navigate = useNavigate();

    const registeredRegions = ['보성군', '보라카이', '담양군', '강릉시', '해남군', '목포시'];

    const filteredRegions = allRegions.filter((region) =>
        region.startsWith(inputValue)
    );

    const handleSubmit = () => {
        if (selectedRegion) {
        localStorage.setItem('selectedRegion', selectedRegion);
        navigate('/');
        } else {
        alert('지역을 선택해주세요.');
        }
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#F9F9F9]">
        <Background />
        <div className="absolute inset-0 bg-[#FFF9C4]/60 z-0"></div>
        {/* 닫기 버튼 */}
        <img
        src="/assets/images/exit_button.png"
        alt="나가기 버튼"
        onClick={() => navigate('/')} //화살표 함수로 이벤트 핸들러 전달
        className="
            absolute
            top-[10px] left-[10px]
            w-[100px] h-auto z-50
            cursor-pointer hover:scale-90 transition-transform duration-200
        "
        />
        {/* 입력창 */}
        <input
            type="text"
            placeholder="지역명을 입력하세요"
            value={inputValue}
            onChange={(e) => {
            setInputValue(e.target.value); //입력값 갱신
            setSelectedRegion(e.target.value); // 입력과 동시에 선택
            }}
            className="
            absolute
            left-[191px] top-[143px] z-50
            w-[641px] h-[130px]
            bg-[#0DA429]
            border-[7px] border-[#0E8E12]
            shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]
            rounded-[20px]
            text-[#FFFAFA] text-[50px] leading-[120%]
            placeholder-[#FFFAFA] placeholder:text-[50px] placeholder:leading-[120%]
            font-bold text-center
            px-4
            "
        />

      {/* 입력값 있을 때, 자동완성 추천 지역 목록 */}
        {inputValue && filteredRegions.length > 0 && (
        <div
            className="
            absolute top-[270px] left-[191px]
            w-[641px] max-h-[450px]
            overflow-y-auto
            flex flex-col gap-4 z-40
            bg-green-600 bg-opacity-25 rounded-[10px] p-8 shadow-lg
            "
        >
            {filteredRegions.map((region) => (
            <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`
                w-full h-[100px]
                ${selectedRegion === region ? 'bg-green-700' : 'bg-[#0DA429]'}
                text-white text-[40px] font-bold
                border-[5px] border-[#0E8E12]
                transition-colors duration-200
                rounded-[20px]
                `}
            >
                {region}
            </button>
            ))}
        </div>
        )}

      {/* 등록된 지역 목록 (입력값이 없을 때) */}
        {!inputValue && (
        <>
        <div
        className="
            absolute
            left-[187px] top-[331px]
            w-[521px] h-[34px]
            text-[30px] leading-[120%]
            font-black
            text-[#0E8E12]
        "
        >
        이미 등록된 지역 목록
        </div>

        <div className="absolute left-[194px] top-[380px] max-w-[90%] w-[640px] overflow-x-auto">
            <div className="flex gap-4">
            {registeredRegions.map((region) => (
                <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`
                    w-[120px] h-[67px]
                    ${selectedRegion === region ? 'bg-green-700' : 'bg-[rgba(11,159,38,0.5)]'}
                    border-[7px] border-[#0E8E12]
                    rounded-[20px]
                    text-white text-[20px] font-extrabold
                    flex-shrink-0 whitespace-nowrap
                `}
                >
                {region}
                </button>
            ))}
            </div>
        </div>
        </>
        )}

      {/* 선택하기 버튼 */}
        <img
        src="/assets/images/select_button_dark.png"
        alt="선택하기 버튼"
        onClick={handleSubmit}
        className="
            absolute
            bottom-[70px] left-1/2 transform -translate-x-1/2
            w-[234px] h-auto z-50
            cursor-pointer hover:scale-95 transition-transform duration-200
        "
        />
    </div>
  );
};

export default SettingPage;
