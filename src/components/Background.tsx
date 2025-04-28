const Background = () => {
    return (
        <div className="absolute inset-0 z-0">
        <img
            src="/background_homepage.png"
            alt="Background"
            className="w-full h-full object-cover"
        />
        </div>
    );
};
/*
const Background = () => {
    return (
    <div className="absolute inset-0 bg-red-500">
    <img
        src="https://via.placeholder.com/1200x800.png?text=Background+Image"
        alt="Background"
        className="w-full h-full object-cover"
    />
    </div>
);
};
*/

export default Background;
