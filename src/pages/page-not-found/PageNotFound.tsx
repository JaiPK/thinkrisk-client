import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate();
    const navigateToHome = () => {
        navigate("/home");
    };

    return (
        <section className="flex items-center h-full p-16 bg-white  text-black font-raleway">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 font-extrabold text-9xl text-gray-600">
                        404
                    </h2>
                    <p className="text-2xl font-semibold md:text-3xl">
                        Sorry, we couldn't find this page.
                    </p>
                    <p className="mt-4 mb-8 text-gray-400">
                        But dont worry, you can find plenty of other things on
                        our homepage.
                    </p>
                    <button onClick={navigateToHome} className="border-none cursor-pointer font-raleway px-8 py-3 font-semibold rounded bg-sky-500 text-white">
                        Back to homepage
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PageNotFound;
