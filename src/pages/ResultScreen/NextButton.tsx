import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';

const next_button = '/assets/images/next_button.png'

interface NextButtonProps {
  to?: string; // optional로 변경
}

const NextButton = ({ to = '/star' }: NextButtonProps) => {
    const navigate = useNavigate();
    const scale = useScale();

    return (
        <img
            src={next_button}
            alt="다음 버튼"
            onClick={() => navigate(to)}
            className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer z-50 hover:scale-105 transition-transform duration-300"
            style={{
                bottom: `calc(10% * ${scale})`,
                width: `calc(27% * ${scale})`,
                height: 'auto'
            }}
        />
    );
};

export default NextButton;