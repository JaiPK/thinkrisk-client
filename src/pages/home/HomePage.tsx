import { useSelector } from "react-redux";
import Header from "../../features/ui/header/Header";
import MainContent from "../../features/ui/mainContent/MainContent";
import { RootState } from "../../store/Store";

const HomePage = () => {
    const openMobileMenu = useSelector((state: RootState) => state.toggleSideNav.open);
    
    return (
        <div className={`flex-col h-screen ${openMobileMenu? 'overflow-hidden md:overflow-auto': null}`}>
            <Header />
            <MainContent />
        </div>
    );
};

export default HomePage;
