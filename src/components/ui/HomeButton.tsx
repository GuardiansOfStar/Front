import { useNavigate } from 'react-router-dom';

const homeButton = '/assets/images/home_button.png'; 

function HomeButton () {
    const navigate = useNavigate();

    return (
        <img
            src={homeButton}
            alt="홈으로"
            className="absolute top-5 right-10 
            w-[9%] h-auto
            cursor-pointer
            z-50
            active:scale-90 transition-transform duration-150"
            onClick={() => navigate('/')}
        />
    );
}

export default HomeButton;
