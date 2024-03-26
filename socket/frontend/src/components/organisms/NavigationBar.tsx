import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import WalletInfo from "./WalletInfo.tsx";
import { SearchField } from "./InputField.tsx";

export default function NavigationBar() {
    return (
        <nav className="border-b border-b-neutral-40">
            <div
                className="flex gap-8 items-center justify-between text-sm font-medium py-3 md:w-mh m-auto px-h md:px-0"
            >

                <div className="flex gap-3 items-center">
                    <img src={logo} alt="Transmit" className="w-8 h-8" />
                    <Link to="/" className="text-neutral-900">Transmit</Link>
                </div>

                <SearchField className="flex-1" />

                <WalletInfo address={"0x1234567890"} />
            </div>
        </nav>
    );
}