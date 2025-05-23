const map = '/assets/images/scenario1_full_map.png'

const MapPage = () => {
    return (
        <div 
            className="w-full h-screen flex items-center justify-center" 
            style={{ backgroundColor: '#8AB948' }} // 배경색 설정
        >
            <img
                src={map} 
                alt="지도"
                className="w-1/2 h-auto 
                "
            />
        </div>
    );
};

export default MapPage;