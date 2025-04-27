const MapPage = () => {
    return (
    <div className="w-full h-screen 
    flex items-center justify-center bg-gray-100">
    <img
        src="/map.png"  // 지도 이미지 경로 (public 폴더에 map.png 넣어!)
        alt="지도"
        className="w-1/2 h-auto 
        rounded-lg 
        shadow-lg"
    />
    </div>
);
};

export default MapPage;
