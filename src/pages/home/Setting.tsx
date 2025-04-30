const setting = '/assets/images/setting.png'

const Setting = () => {
    return (
        <img
            src={setting}
            alt="setting"
            className="absolute top-5 right-10 
            w-[100px] h-auto
            cursor-pointer
            z-50
            active:scale-90 transition-transform duration-150"
        />
    );
};

export default Setting;