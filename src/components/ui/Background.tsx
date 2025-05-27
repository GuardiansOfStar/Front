import { useScale } from '../../hooks/useScale';

const background_homepage = '/assets/images/background.png';

const Background = () => {
    const scale = useScale();

    return (
        <div 
            className="w-full h-full"
            style={{
                // 스케일에 따라 배경 이미지 크기 조정이 필요한 경우를 대비
                transform: `scale(${Math.max(1, scale)})`,
                transformOrigin: 'center center'
            }}
        >
            <img
                src={background_homepage}
                alt="Background"
                className="w-full h-full object-cover"
                style={{
                    // 고해상도에서 이미지 품질 최적화
                    imageRendering: scale > 1.2 ? 'crisp-edges' : 'auto'
                }}
            />
        </div>
    );
};

export default Background;