import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../../components/ui/Background';

const locationData = {
    서울특별시 : ["서울특별시 종로구", "서울특별시 중구", "서울특별시 용산구", "서울특별시 성동구", "서울특별시 광진구", "서울특별시 동대문구", "서울특별시 중랑구", "서울특별시 성북구", "서울특별시 강북구", "서울특별시 도봉구", "서울특별시 노원구", "서울특별시 은평구", "서울특별시 서대문구", "서울특별시 마포구", "서울특별시 양천구", "서울특별시 강서구", "서울특별시 구로구", "서울특별시 금천구", "서울특별시 영등포구", "서울특별시 동작구", "서울특별시 관악구", "서울특별시 서초구", "서울특별시 강남구", "서울특별시 송파구", "서울특별시 강동구"],
    부산광역시: ["부산광역시 중구", "부산광역시 서구", "부산광역시 동구", "부산광역시 영도구", "부산광역시 부산진구", "부산광역시 동래구", "부산광역시 남구", "부산광역시 북구", "부산광역시 해운대구", "부산광역시 사하구", "부산광역시 금정구", "부산광역시 강서구", "부산광역시 연제구", "부산광역시 수영구", "부산광역시 사상구", "부산광역시 기장군"],
    대구광역시 : ["대구광역시 중구", "대구광역시 동구", "대구광역시 서구", "대구광역시 남구", "대구광역시 북구", "대구광역시 수성구", "대구광역시 달서구", "대구광역시 달성군"],
    인천광역시 : ["인천광역시 중구", "인천광역시 동구", "인천광역시 남구", "인천광역시 미추홀구", "인천광역시 연수구", "인천광역시 남동구", "인천광역시 부평구", "인천광역시 계양구", "인천광역시 서구", "인천광역시 강화군", "인천광역시 옹진군"],
    광주광역시: ["광주광역시 동구", "광주광역시 서구", "광주광역시 남구", "광주광역시 북구", "광주광역시 광산구"],
    대전광역시: ["대전광역시 동구", "대전광역시 중구", "대전광역시 서구", "대전광역시 유성구", "대전광역시 대덕구"],
    울산광역시: ["울산광역시 중구", "울산광역시 남구", "울산광역시 동구", "울산광역시 북구", "울산광역시 울주군"],
    세종특별자치시 : ["세종특별자치시"],
    경기도 : ["경기도 수원시", "경기도 성남시", "경기도 고양시", "경기도 용인시", "경기도 부천시", "경기도 안산시", "경기도 안양시", "경기도 남양주시", "경기도 화성시", "경기도 평택시", "경기도 의정부시", "경기도 시흥시", "경기도 파주시", "경기도 광명시", "경기도 김포시", "경기도 군포시", "경기도 광주시", "경기도 이천시", "경기도 양주시", "경기도 오산시", "경기도 구리시", "경기도 안성시", "경기도 포천시", "경기도 의왕시", "경기도 하남시", "경기도 여주시", "경기도 여주군", "경기도 양평군", "경기도 동두천시", "경기도 과천시", "경기도 가평군", "경기도 연천군"],
    강원도 : ["강원도 춘천시", "강원도 원주시", "강원도 강릉시", "강원도 동해시", "강원도 태백시", "강원도 속초시", "강원도 삼척시", "강원도 홍천군", "강원도 횡성군", "강원도 영월군", "강원도 평창군", "강원도 정선군", "강원도 철원군", "강원도 화천군", "강원도 양구군", "강원도 인제군", "강원도 고성군", "강원도 양양군"],
    충청북도: ["충청북도 청주시", "충청북도 충주시", "충청북도 제천시", "충청북도 청원군", "충청북도 보은군", "충청북도 옥천군", "충청북도 영동군", "충청북도 진천군", "충청북도 괴산군", "충청북도 음성군", "충청북도 단양군", "충청북도 증평군"],
    충청남도 : ["충청남도 천안시", "충청남도 공주시", "충청남도 보령시", "충청남도 아산시", "충청남도 서산시", "충청남도 논산시", "충청남도 계룡시", "충청남도 당진시", "충청남도 당진군", "충청남도 금산군", "충청남도 연기군", "충청남도 부여군", "충청남도 서천군", "충청남도 청양군", "충청남도 홍성군", "충청남도 예산군", "충청남도 태안군"],
    전라북도 : ["전라북도 전주시", "전라북도 군산시", "전라북도 익산시", "전라북도 정읍시", "전라북도 남원시", "전라북도 김제시", "전라북도 완주군", "전라북도 진안군", "전라북도 무주군", "전라북도 장수군", "전라북도 임실군", "전라북도 순창군", "전라북도 고창군", "전라북도 부안군"],
    전라남도: ["전라남도 목포시", "전라남도 여수시", "전라남도 순천시", "전라남도 나주시", "전라남도 광양시", "전라남도 담양군", "전라남도 곡성군", "전라남도 구례군", "전라남도 고흥군", "전라남도 보성군", "전라남도 화순군", "전라남도 장흥군", "전라남도 강진군", "전라남도 해남군", "전라남도 영암군", "전라남도 무안군", "전라남도 함평군", "전라남도 영광군", "전라남도 장성군", "전라남도 완도군", "전라남도 진도군", "전라남도 신안군"],
    경상북도: ["경상북도 포항시", "경상북도 경주시", "경상북도 김천시", "경상북도 안동시", "경상북도 구미시", "경상북도 영주시", "경상북도 영천시", "경상북도 상주시", "경상북도 문경시", "경상북도 경산시", "경상북도 군위군", "경상북도 의성군", "경상북도 청송군", "경상북도 영양군", "경상북도 영덕군", "경상북도 청도군", "경상북도 고령군", "경상북도 성주군", "경상북도 칠곡군", "경상북도 예천군", "경상북도 봉화군", "경상북도 울진군", "경상북도 울릉군"],
    경상남도: ["경상남도 창원시", "경상남도 마산시", "경상남도 진주시", "경상남도 진해시", "경상남도 통영시", "경상남도 사천시", "경상남도 김해시", "경상남도 밀양시", "경상남도 거제시", "경상남도 양산시", "경상남도 의령군", "경상남도 함안군", "경상남도 창녕군", "경상남도 고성군", "경상남도 남해군", "경상남도 하동군", "경상남도 산청군", "경상남도 함양군", "경상남도 거창군", "경상남도 합천군"],
    제주특별자치도: ["제주특별자치도 제주시", "제주특별자치도 서귀포시", "제주특별자치도 북제주군", "제주특별자치도 남제주군"],
};

const SettingPage = () => {
    const [inputValue, setInputValue] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    // 👁 자동완성 목록 표시 여부
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();

    // 모든 지역명 추출 후 가나다 순 정렬
    const allRegions = Object.values(locationData).flat(); // 시군구 전부 모으기
    const sortedRegions = allRegions
        .filter(region => region.includes(inputValue)) // 입력된 단어 포함 여부
        .sort((a, b) => a.localeCompare(b, 'ko')); // 한글 가나다순 정렬

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
            onClick={() => navigate('/')}
            className="absolute top-[10px] left-[10px] w-[100px] h-auto z-50 cursor-pointer hover:scale-90 transition-transform duration-200"
        />

        {/* 입력창 */}
        <input
            type="text"
            placeholder="지역명을 입력하세요"
            value={inputValue}
            onChange={(e) => { //사용자가 입력창에 sth 입력할 때마다 호출
            setInputValue(e.target.value); //입력한 값을 상태 inputValue에 저장
            setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)} // 입력창 클릭 시 자동완성 표시. 포커스: 현재 키보드나 입력을 어디에 하고 있는지를 브라우저가 인식하는 상태.
            onBlur={() => setTimeout(() => setShowSuggestions(false), 800)} // 포커스 잃으면 숨김 (만약 바로 setShowSuggestions(false)만 쓰면,사용자가 추천 목록 버튼을 클릭하기 전에 자동완성 목록이 사라져서 클릭이 무시됩니다.)
            className="absolute left-[191px] top-[143px] z-50 w-[641px] h-[130px] bg-[#0DA429] border-[7px] border-[#0E8E12] shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)] rounded-[20px] text-[#FFFAFA] text-[50px] leading-[120%] placeholder-[#FFFAFA] placeholder:text-[50px] placeholder:leading-[120%] font-bold text-center px-4"
        />

        {/* 자동완성 목록 */}
        {showSuggestions && sortedRegions.length > 0 && (
            <div className="absolute top-[270px] left-[191px] w-[641px] max-h-[450px] overflow-y-auto flex flex-col gap-4 z-40 bg-green-600 bg-opacity-25 rounded-[10px] p-8 shadow-lg">
            {sortedRegions.map((region) => (
                <button
                key={region}
                onClick={() => {
                    setSelectedRegion(region); // 선택된 지역으로 저장
                    setInputValue(region);     // 입력창에도 반영
                    setShowSuggestions(false); // 자동완성 닫기
                }}
                className={`w-full h-[100px] flex justify-center items-center ${selectedRegion === region ? 'bg-green-700' : 'bg-[#0DA429]'} text-white text-[40px] font-bold border-[5px] border-[#0E8E12] transition-colors duration-200 rounded-[20px]`}
                >
                {region}
                </button>
            ))}
            </div>
        )}

        {/* 선택하기 버튼 */}
        <img
            src="/assets/images/select_button_dark.png"
            alt="선택하기 버튼"
            onClick={handleSubmit}
            className="absolute bottom-[70px] left-1/2 transform -translate-x-1/2 
            w-[234px] h-auto z-30 cursor-pointer hover:scale-90 transition-transform duration-200"
        />
        </div>
    );
};

export default SettingPage;
