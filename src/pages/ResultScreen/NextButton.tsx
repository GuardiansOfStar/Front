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
                width: `calc(200px * ${scale})`,
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: `calc(40px * ${scale})`,
            }}
        />
    );
};

export default NextButton;