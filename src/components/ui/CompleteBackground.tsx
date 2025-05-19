import completion_background from '/assets/images/success_background_blur.png'

const CompleteBackground = () => {
    return (
        <img
            src={completion_background}
            alt="주행 완료 후 배경"
            className="absolute w-full h-full"
        />
    );
};

export default CompleteBackground;
