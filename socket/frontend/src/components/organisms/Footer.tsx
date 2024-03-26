export default function Footer() {
    return (
        <footer>
            <p className="text-center text-neutral-900 font-medium text-body p-4">
                &copy; {new Date().getFullYear()} Transmit. All rights reserved.
            </p>
        </footer>
    );
}