import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';

const next_button = '/assets/images/next_button.png'

interface NextButtonProps {
  to?: string;
}

const NextButton = ({ to = '/star' }: NextButtonProps) => {
    const navigate = useNavigate();
    const scale = useScale();

    return (
        <img
            src={next_button}
            alt="다음 버튼"
            onClick={() => navigate(to)}
            className="absolute cursor-pointer z-50 hover:scale-105 transition-transform duration-300"
            style={{
                bottom: `calc(80px * ${scale})`,
                left: `calc(362px * ${scale})`, // 중앙 정렬: (1024 - 231) / 2 (UI Size에서 231 × 106)
                width: `calc(231px * ${scale})`,
                height: `calc(106px * ${scale})`
            }}
        />
    );
};

export default NextButton;