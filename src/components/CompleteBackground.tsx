import completion_background from 'assets/images/completion_background.png'

const Completion_Background = () => {
    return (
        <div className="absolute inset-0 z-0">
        <img
            src={completion_background}
            alt="주행 완료 후 배경"
            className="w-full h-full object-cover"
        />
        </div>
    );
};

export default Completion_Background;
