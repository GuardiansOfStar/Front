const BackButton = () => {
    const handleBack = () => {
        window.history.back();  // 브라우저 히스토리 강제 뒤로가기
    };

    return (
        <img 
        src="/back_button.png" 
        alt="뒤로가기"
        onClick={handleBack}
        className="absolute top-4 left-4 
        w-[100px] h-auto 
        cursor-pointer z-50 
        active:scale-90 transition-transform duration-150"
        />
    );
};

export default BackButton;
