const background_homepage = '/assets/images/background_homepage.png';

const Background = () => {
    return (
        <div className="absolute w-full h-full">
        <img
            src={background_homepage}
            alt="Background"
            className="w-full h-full object-cover"
        />
        </div>
    );
};

export default Background;
